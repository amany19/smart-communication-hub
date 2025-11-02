import jwt ,{SignOptions}from 'jsonwebtoken';
import Env from '../config/env.config';
import { UserType } from '../types/user.types';

const {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_LIFE = '15m',
  REFRESH_TOKEN_LIFE = '60d',
} = Env;
export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
 
const generateToken = (
  payload: object,
  secretKey: string,
  expiresIn?: string | number
): string => {
  if (!secretKey) throw new Error('Secret key is required for token generation.');

  const options: SignOptions = {
    expiresIn: (expiresIn || '60d') as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secretKey, options);
};

 
const generateUserTokens = (user: Pick<UserType, 'id' | 'email'>, jti: string) => {
  if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error('JWT secrets are not configured in environment variables.');
  }

  const accessPayload = { id: user.id, email: user.email };
  const refreshPayload = { ...accessPayload, jti };

  const accessToken = generateToken(accessPayload, ACCESS_SECRET, ACCESS_TOKEN_LIFE);
  const refreshToken = generateToken(refreshPayload, REFRESH_SECRET, REFRESH_TOKEN_LIFE);

  return { accessToken, refreshToken };
};


const verifyToken = (token: string, secretKey: string): jwt.JwtPayload => {
  if (!token) throw new Error('Token is missing.');
  if (!secretKey) throw new Error('Secret key is missing.');

  try {
    return jwt.verify(token, secretKey) as jwt.JwtPayload;
  } catch (err: any) {
    throw new Error(`Token verification failed: ${err.message}`);
  }
};
function generateJti(): string {
  return crypto.randomUUID();
}
 
const refreshTokens = (refreshToken: string) => {
  if (!REFRESH_SECRET || !ACCESS_SECRET) {
    throw new Error('JWT secrets are missing from configuration.');
  }

  const decoded = verifyToken(refreshToken, REFRESH_SECRET);

  if (!decoded || !decoded.id || !decoded.email) {
    throw new Error('Invalid refresh token payload.');
  }

  //  check if refresh token was revoked in DB.

  // Generate a new jti 
  const newJti = crypto.randomUUID();

  // Issue new tokens
  const { accessToken, refreshToken: newRefreshToken } = generateUserTokens(
    { id: decoded.id, email: decoded.email },
    newJti
  );

  return { accessToken, refreshToken: newRefreshToken };
};

 

export { generateToken, verifyToken,generateJti, generateUserTokens, refreshTokens, };
