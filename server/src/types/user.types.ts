export interface UserType {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePhoto?: string | null;
  isOnline?:boolean;
  lastSeen?:Date;
  createdAt?: Date;       
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Partial<Omit<UserType, 'email' | 'password' | 'name'>> {}
