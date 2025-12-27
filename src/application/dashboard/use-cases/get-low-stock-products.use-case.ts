import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '@domain/products/ports/product.repository.port';
import { Product } from '@domain/products/entities/product.entity';

@Injectable()
export class GetLowStockProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(limit?: number): Promise<{ data: Product[] }> {
    const products = await this.productRepository.findLowStock(limit);
    return { data: products };
  }
}

