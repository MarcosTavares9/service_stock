import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '@domain/products/ports/product.repository.port';
import { NotFoundException } from '@shared/exceptions/business.exception';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: number) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Produto');
    }

    return product;
  }
}

