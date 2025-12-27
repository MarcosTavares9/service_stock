import { Injectable, Inject } from '@nestjs/common';
import { ICategoryRepository } from '@domain/categories/ports/category.repository.port';
import { Category } from '@domain/categories/entities/category.entity';

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<{ data: Category[] }> {
    const categories = await this.categoryRepository.findAll();
    return { data: categories };
  }
}

