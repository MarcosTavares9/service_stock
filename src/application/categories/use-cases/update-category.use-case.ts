import { Injectable, Inject } from '@nestjs/common';
import { ICategoryRepository } from '@domain/categories/ports/category.repository.port';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { NotFoundException, ConflictException } from '@shared/exceptions/business.exception';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Categoria');
    }

    if (dto.nome && dto.nome !== category.nome) {
      const existingCategory = await this.categoryRepository.findByName(dto.nome);
      if (existingCategory) {
        throw new ConflictException('Nome de categoria já existe');
      }
      category.nome = dto.nome;
    }

    if (dto.iconName !== undefined) {
      category.iconName = dto.iconName;
    }

    return this.categoryRepository.update(category);
  }
}

