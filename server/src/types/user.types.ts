export interface UserType {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  profilePhoto?: string | null;
  createdAt?: Date;       
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Partial<Omit<UserType, 'email' | 'passwordHash' | 'name'>> {}
