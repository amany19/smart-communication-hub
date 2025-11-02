import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.config';
import { MessageType, MessageCreationAttributes } from '../types/message.types';

export default class Message
  extends Model<MessageType, MessageCreationAttributes>
  implements MessageType
{
  public id!: string;
  public sender_id!: string;
  public receiver_id!: string;
  public text!: string;
  public timestamp!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'messages',
    modelName: 'Message',
  }
);
