import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
  findById(id: number): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findByName(nome: string): Promise<Category | null>;
  create(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: number): Promise<void>;
}

