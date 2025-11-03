import bcrypt from 'bcryptjs';
import { IUserRepository } from '../repositories';
import { UserType } from '../types';
import { IUser } from './interfaces';
 

export default class UserService implements IUser {
  constructor(private userRepo: IUserRepository) {}

  async register(data: Omit<UserType, 'id'>): Promise<UserType> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new Error('Email already in use');

    const password = await bcrypt.hash(data.password, 10);
    return await this.userRepo.createUser({ ...data, password });
  }

  async getUser(id: string): Promise<Omit<UserType,'password'> | null> {
    return await this.userRepo.findById(id);
  }
    async getAllUsers(): Promise<Omit<UserType,'password'> []| null> {
    return await this.userRepo.getAll();
  }


  async updateUser(id: string, updates: Partial<UserType>): Promise<Omit<UserType, 'password'> | null> {
    return await this.userRepo.updateUser(id, updates);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepo.deleteUser(id);
  }
}
