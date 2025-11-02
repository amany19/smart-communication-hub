import { Op } from 'sequelize';
import Message from '../models/message.model';
import { MessageType, MessageCreationAttributes, UserType, MessageWithAssociations } from '../types';
import { User } from '../models';

export interface IMessageRepository {
  createMessage(data: MessageCreationAttributes): Promise<MessageType>;
  findById(id: string): Promise<MessageType | null>;
  findConversation(sender_id: string, receiver_id: string): Promise<MessageType[]>;
  getChatList(userId: string):Promise<Partial<MessageType>[]>;
  updateMessage(id: string, updates: Partial<MessageType>): Promise<MessageType | null>
  deleteMessage(id: string): Promise<boolean>;
}

export class MessageRepository implements IMessageRepository {
  async createMessage(data: MessageCreationAttributes): Promise<MessageType> {
    const message = await Message.create(data);
    return message.get({ plain: true }) as MessageType;
  }

  async findById(id: string): Promise<MessageType | null> {
    const message = await Message.findByPk(id);
    return message ? (message.get({ plain: true }) as MessageType) : null;
  }

  async findConversation(sender_id: string, receiver_id: string): Promise<MessageType[]> {
    const messages = await Message.findAll({
      where: {
        sender_id: [sender_id, receiver_id],
        receiver_id: [sender_id, receiver_id],
      },
      order: [['timestamp', 'ASC']],
    });
    return messages.map((m) => m.get({ plain: true }) as MessageType);
  }
async getChatList(userId: string) {
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { sender_id: userId },
        { receiver_id: userId },
      ],
    },
    include: [
      { model: User, as: "sender", attributes: ["id", "name", "profilePhoto"] },
      { model: User, as: "receiver", attributes: ["id", "name", "profilePhoto"] },
    ],
    order: [["timestamp", "DESC"]],
  }) as unknown as MessageWithAssociations[];

  const map = new Map();

  for (const msg of messages) {
    const otherUser = msg.sender_id === userId ? msg.receiver : msg.sender;

    if (otherUser && !map.has(otherUser.id)) {
      map.set(otherUser.id, {
        lastMessage: msg,
        user: otherUser,
      });
    }
  }

  return Array.from(map.values());
}
async updateMessage(id: string, updates: Partial<MessageType>): Promise<MessageType | null> {
  const message = await Message.findByPk(id);
  if (!message) return null;

  await message.update(updates);
  return message.get({ plain: true }) as MessageType;
}

  async deleteMessage(id: string): Promise<boolean> {
    const deleted = await Message.destroy({ where: { id } });
    return deleted > 0;
  }
}
