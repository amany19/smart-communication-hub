import { User } from '../models';
import { UserType } from '../types/user.types';


export interface IUserRepository {
  createUser(data: Omit<UserType, 'id'>): Promise<UserType>;
  findByEmail(email: string): Promise<UserType | null>;
  findById(id: string): Promise<Omit<UserType, 'passwordHash'> | null>;
  getAll(): Promise<Omit<UserType, 'passwordHash'>[] | null>;
  updateUser(id: string, updates: Partial<UserType>): Promise<Omit<UserType, 'passwordHash'> | null>;
  deleteUser(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async createUser(data: Omit<UserType, 'id'>): Promise<UserType> {
    const user = await User.create(data);
    return user.get({ plain: true }) as UserType;
  }

  async findByEmail(email: string): Promise<UserType | null> {
    const user = await User.findOne({ where: { email } });
    return user ? (user.get({ plain: true }) as UserType) : null;
  }

  async findById(id: string): Promise<Omit<UserType, 'passwordHash'> | null> {
    const user = await User.findByPk(id, { attributes: { exclude: ['passwordHash'] } });
    return user ? (user.get({ plain: true }) as UserType) : null;
  }
    async getAll(): Promise<Omit<UserType, 'passwordHash'>[] | null> {
    const user = await User.findAll({ attributes: { exclude: ['passwordHash'] } });
    return user?.map( (user)=> (user.get({ plain: true }) as UserType));
  }

  async updateUser(id: string, updates: Partial<UserType>): Promise<Omit<UserType, 'passwordHash'> | null> {
    const user = await User.findByPk(id, { attributes: { exclude: ['passwordHash'] } });
    if (!user) return null;
    await user.update(updates);
    return user.get({ plain: true }) as UserType;
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleted = await User.destroy({ where: { id } });
    return deleted > 0;
  }
}
