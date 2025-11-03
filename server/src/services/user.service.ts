import bcrypt from 'bcryptjs';
import { IUserRepository } from '../repositories';
import { UserType } from '../types';
import { IUser } from './interfaces';
 

export default class UserService implements IUser {
  constructor(private userRepo: IUserRepository) {}

  async register(data: Omit<UserType, 'id'>): Promise<UserType> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new Error('Email already in use');

    const passwordHash = await bcrypt.hash(data.passwordHash, 10);
    return await this.userRepo.createUser({ ...data, passwordHash });
  }

  async getUser(id: string): Promise<Omit<UserType,'passwordHash'> | null> {
    return await this.userRepo.findById(id);
  }
    async getAllUsers(): Promise<Omit<UserType,'passwordHash'> []| null> {
    return await this.userRepo.getAll();
  }


  async updateUser(id: string, updates: Partial<UserType>): Promise<Omit<UserType, 'passwordHash'> | null> {
    return await this.userRepo.updateUser(id, updates);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepo.deleteUser(id);
  }
}
