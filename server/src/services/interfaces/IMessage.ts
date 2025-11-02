import { MessageType } from '../../types';

export default interface IMessage {
    sendMessage(data: Omit<MessageType, 'id'>): Promise<MessageType>;
    getMessage(id: string): Promise<MessageType | null>;
    getConversation(sender_id: string, receiver_id: string): Promise<MessageType[]>;
    getChatList(userId: string):Promise<Partial<MessageType>[]>;
    editMessage(id: string, updates: Partial<MessageType>): Promise<MessageType | null>;
    deleteMessage(id: string): Promise<boolean>;
}
