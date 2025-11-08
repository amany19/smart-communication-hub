import { ChatMessage } from ".";

export interface User {
  id: string;
  name: string;
  profilePhoto?: string; 
}
export interface ContactUser  {
  user: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
  lastMessage?: ChatMessage;
};
export type SidebarItemType =User|ContactUser