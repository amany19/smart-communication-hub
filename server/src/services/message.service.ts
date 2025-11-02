import { IMessageRepository } from '../repositories/message.repo';
import { MessageType } from '../types';
import IMessage from './interfaces/IMessage';

export default class MessageService implements IMessage {
    constructor(private messageRepo: IMessageRepository) { }
    async sendMessage(data: Omit<MessageType, 'id'>): Promise<MessageType> {
        
        return await this.messageRepo.createMessage(data);
    }
    async getMessage(id: string): Promise<MessageType | null> {
        return await this.messageRepo.findById(id);
    }
    async getConversation(sender_id: string, receiver_id: string): Promise<MessageType[]> {
        return await this.messageRepo.findConversation(sender_id, receiver_id);
    }
    async getChatList(userId: string):Promise<Partial<MessageType>[]> {
    console.log(`logger ${userId}`)

     return await this.messageRepo.getChatList(userId)   
    }
    async editMessage(id: string, updates: Partial<MessageType>): Promise<MessageType | null> {
        return await this.messageRepo.updateMessage(id, updates);
    }
    async deleteMessage(id: string): Promise<boolean> {
        return await this.messageRepo.deleteMessage(id);
    }
}
