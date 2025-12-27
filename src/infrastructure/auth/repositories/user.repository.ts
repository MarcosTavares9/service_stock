import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '@domain/auth/entities/user.entity';
import { IUserRepository } from '@domain/auth/ports/user.repository.port';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async update(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ users: User[]; total: number }> {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        '(user.nome ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { users, total };
  }

  async findByConfirmationToken(token: string): Promise<User | null> {
    return this.repository.findOne({ where: { confirmationToken: token } });
  }
}

