export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
}

export interface ChatMessage {
  id?: string;
  text: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
  status?:string
}
