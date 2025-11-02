import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../config/database.config';

export default class RefreshToken extends Model {
  static initialize(sequelize: Sequelize) {
      throw new Error("Method not implemented.");
  }
  public id!: number;
  public jti!: string;         
  public userId!: string;      //FK to users.id
  public expiresAt!: Date;
  public revoked!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RefreshToken.init({
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  jti: { type: DataTypes.STRING, allowNull: false, unique: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  revoked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
  sequelize,
  tableName: 'refresh_tokens',
  modelName: 'RefreshToken',
});
