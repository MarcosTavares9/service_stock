import { User } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ users: User[]; total: number }>;
  findByConfirmationToken(token: string): Promise<User | null>;
}

