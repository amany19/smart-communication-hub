import { RefreshToken } from '../models';
import { Op } from 'sequelize';
// Interface
export interface IRefreshTokenRepository {

  create(jti: string, userId: string, expiresAt: Date): Promise<void>;
  findValid(jti: string): Promise<{ jti: string; userId: string } | null>;
  revoke(jti: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}
// implementation
export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(jti: string, userId: string, expiresAt: Date): Promise<void> {
    await RefreshToken.create({ jti, userId, expiresAt, revoked: false });
  }

  async findValid(jti: string): Promise<{ jti: string; userId: string } | null> {
    const rec = await RefreshToken.findOne({
      where: {
        jti,
        revoked: false,
        expiresAt: { [Op.gt]: new Date() },
      }
    });
    if (!rec) return null;
    return { jti: rec.jti, userId: rec.userId };
  }

  async revoke(jti: string): Promise<void> {
    await RefreshToken.update({ revoked: true }, { where: { jti } });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await RefreshToken.update({ revoked: true }, { where: { userId } });
  }
}
