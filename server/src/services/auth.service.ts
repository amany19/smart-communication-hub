import Env from '../config/env.config';
import { parseDuration } from '../utils/durationParsing.utils';
import bcrypt from 'bcryptjs';
import { IAuth } from './interfaces';
import { IUserRepository } from '../repositories';
import { IRefreshTokenRepository } from '../repositories/refreshToken.repo';
import { generateJti, generateUserTokens, verifyToken } from '../utils/auth.util';
import type { TokenPair } from '../utils/auth.util';
export default class AuthService implements IAuth {
  constructor(
    private userRepo: IUserRepository,
    private refreshTokenRepo: IRefreshTokenRepository
  ) {}

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    // Revoke old tokens for user 
    await this.refreshTokenRepo.revokeAllForUser(user.id);

    const jti = generateJti();
    const tokens = generateUserTokens({ id: user.id, email: user.email }, jti);

    const expiresAt = new Date(Date.now() + (parseDuration(Env.REFRESH_TOKEN_LIFE) || 0));
    await this.refreshTokenRepo.create(jti, user.id, expiresAt);

    return tokens;
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    //verify signature
    const decoded = verifyToken(refreshToken, Env.REFRESH_SECRET!);
    const { id, email, jti } = decoded as any;
    if (!jti || !id || !email) {
      throw new Error('Invalid token payload');
    }

    // check repository
    const stored = await this.refreshTokenRepo.findValid(jti);
    if (!stored || stored.userId !== id) {
      throw new Error('Refresh token revoked or invalid');
    }

    //revoke old & issue new tokens (Refresh &Access)
    await this.refreshTokenRepo.revoke(jti);
    const newJti = generateJti();
    const tokens = generateUserTokens({ id, email }, newJti);
    const expiresAt = new Date(Date.now() + (parseDuration(Env.REFRESH_TOKEN_LIFE) || 0));
    await this.refreshTokenRepo.create(newJti, id, expiresAt);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.refreshTokenRepo.revokeAllForUser(userId);
  }
}


