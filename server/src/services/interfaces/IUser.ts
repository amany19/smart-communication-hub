import { UserType } from "../../types";
 

export default interface IUser {
  register(data: Omit<UserType, 'id'>): Promise<UserType>;
  getUser(id: string): Promise<Omit<UserType,'password'> | null>;
  getAllUsers():Promise<Omit<UserType,'password'>[] | null>;
  updateUser(id: string, updates: Partial<UserType>): Promise<Omit<UserType, 'password'> | null>;
  deleteUser(id: string): Promise<boolean>;
}