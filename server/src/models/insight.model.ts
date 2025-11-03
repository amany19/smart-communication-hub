// models/Insight.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.config';
import { InsightType, InsightCreationAttributes } from '../types/insight.types';

export default class Insight
  extends Model<InsightType, InsightCreationAttributes>
  implements InsightType
{
  public id!: string;
  public conversation_id!: string;
  public summary!: string;
  public sentiment!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Insight.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversation_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      }
    },
    summary: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true,
      }
    },
    sentiment: {
      type: DataTypes.STRING,

 
    },

  },
  {
    sequelize,
    tableName: 'insights',
    modelName: 'Insight',
    timestamps: true, 
  }
);