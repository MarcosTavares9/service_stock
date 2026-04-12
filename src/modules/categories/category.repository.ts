import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

export interface ICategoryRepository {
  findById(uuid: string, userId?: string): Promise<Category | null>;
  findAll(userId?: string): Promise<Category[]>;
  findByName(name: string, userId: string): Promise<Category | null>;
  create(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(uuid: string): Promise<void>;
}

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async findById(uuid: string, _userId?: string): Promise<Category | null> {
    return this.repository.findOne({ where: { uuid } });
  }

  async findAll(_userId?: string): Promise<Category[]> {
    return this.repository.find({
      where: { status: EntityStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findByName(name: string, userId: string): Promise<Category | null> {
    return this.repository.findOne({ where: { name, user_id: userId } });
  }

  async create(category: Category): Promise<Category> {
    return this.repository.save(category);
  }

  async update(category: Category): Promise<Category> {
    return this.repository.save(category);
  }

  async delete(uuid: string): Promise<void> {
    await this.repository.delete({ uuid });
  }
}
