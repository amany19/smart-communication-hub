export interface MessageType {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageCreationAttributes
  extends Partial<Omit<MessageType, 'sender_id' | 'receiver_id' | 'text'>> {}
