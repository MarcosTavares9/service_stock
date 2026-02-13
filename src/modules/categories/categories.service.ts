import { Injectable, Inject } from '@nestjs/common';
import { ICategoryRepository } from './category.repository';
import { IProductRepository } from '../products/product.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';
import {
  NotFoundException,
  ConflictException,
  BusinessException,
} from '../../shared/core/business.exception';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async list(): Promise<{ data: Category[] }> {
    const categories = await this.categoryRepository.findAll();
    return { data: categories };
  }

  async getById(uuid: string) {
    const category = await this.categoryRepository.findById(uuid);
    if (!category) {
      throw new NotFoundException('Categoria');
    }
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findByName(dto.name);
    if (existingCategory) {
      throw new ConflictException('Nome de categoria já existe');
    }

    const category = new Category();
    category.name = dto.name;
    category.icon_name = dto.icon_name;

    return this.categoryRepository.create(category);
  }

  async update(uuid: string, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findById(uuid);
    if (!category) {
      throw new NotFoundException('Categoria');
    }

    if (dto.name && dto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findByName(dto.name);
      if (existingCategory) {
        throw new ConflictException('Nome de categoria já existe');
      }
      category.name = dto.name;
    }

    if (dto.icon_name !== undefined) {
      category.icon_name = dto.icon_name;
    }

    return this.categoryRepository.update(category);
  }

  async delete(uuid: string) {
    const category = await this.categoryRepository.findById(uuid);
    if (!category) {
      throw new NotFoundException('Categoria');
    }

    const products = await this.productRepository.findByCategory(category.uuid);
    if (products.length > 0) {
      throw new BusinessException('Não é possível deletar categoria com produtos associados');
    }

    await this.categoryRepository.delete(uuid);
    return { message: 'Categoria deletada com sucesso' };
  }
}
