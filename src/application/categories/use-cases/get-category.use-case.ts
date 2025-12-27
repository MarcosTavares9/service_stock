import { Injectable, Inject } from '@nestjs/common';
import { ICategoryRepository } from '@domain/categories/ports/category.repository.port';
import { NotFoundException } from '@shared/exceptions/business.exception';

@Injectable()
export class GetCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(id: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Categoria');
    }

    return category;
  }
}

