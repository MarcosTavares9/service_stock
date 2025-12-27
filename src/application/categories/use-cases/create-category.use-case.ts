import { Injectable, Inject } from '@nestjs/common';
import { ICategoryRepository } from '@domain/categories/ports/category.repository.port';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '@domain/categories/entities/category.entity';
import { ConflictException } from '@shared/exceptions/business.exception';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findByName(dto.nome);

    if (existingCategory) {
      throw new ConflictException('Nome de categoria já existe');
    }

    const category = new Category();
    category.nome = dto.nome;
    category.iconName = dto.iconName;

    return this.categoryRepository.create(category);
  }
}

