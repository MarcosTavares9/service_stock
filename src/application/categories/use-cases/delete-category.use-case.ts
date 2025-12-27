import { Injectable, Inject } from '@nestjs/common';
import { ICategoryRepository } from '@domain/categories/ports/category.repository.port';
import { IProductRepository } from '@domain/products/ports/product.repository.port';
import { NotFoundException, BusinessException } from '@shared/exceptions/business.exception';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Categoria');
    }

    const products = await this.productRepository.findByCategory(category.nome);

    if (products.length > 0) {
      throw new BusinessException(
        'Não é possível deletar categoria com produtos associados',
      );
    }

    await this.categoryRepository.delete(id);

    return { message: 'Categoria deletada com sucesso' };
  }
}

