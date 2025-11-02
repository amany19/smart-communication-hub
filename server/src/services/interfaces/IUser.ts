import { UserType } from "../../types";
 

export default interface IUser {
  register(data: Omit<UserType, 'id'>): Promise<UserType>;
  getUser(id: string): Promise<Omit<UserType,'passwordHash'> | null>;
  updateUser(id: string, updates: Partial<UserType>): Promise<Omit<UserType, 'passwordHash'> | null>;
  deleteUser(id: string): Promise<boolean>;
}