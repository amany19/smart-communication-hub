import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../config/database.config';
import { UserType, UserCreationAttributes } from '../types/user.types';

export default class User extends Model<UserType, UserCreationAttributes> implements UserType {

  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public profilePhoto?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  }

);

 
