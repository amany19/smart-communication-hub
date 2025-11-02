export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
}

export interface ChatMessage {
  id?: string;
  text: string;
  senderId: string;
  timestamp: string;
}
