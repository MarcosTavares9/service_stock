import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@domain/categories/entities/category.entity';
import { ICategoryRepository } from '@domain/categories/ports/category.repository.port';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async findById(id: number): Promise<Category | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Category[]> {
    return this.repository.find({ order: { nome: 'ASC' } });
  }

  async findByName(nome: string): Promise<Category | null> {
    return this.repository.findOne({ where: { nome } });
  }

  async create(category: Category): Promise<Category> {
    return this.repository.save(category);
  }

  async update(category: Category): Promise<Category> {
    return this.repository.save(category);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

