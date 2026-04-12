import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../products/product.repository';
import { Product } from '../products/product.entity';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async getStats(_userId: string) {
    const stats = await this.productRepository.getStockStats();

    return {
      totalProducts: stats.total,
      totalCategories: stats.totalCategories,
      totalLocations: stats.totalLocations,
      lowStockProducts: stats.lowCount,
      emptyStockProducts: stats.emptyCount,
    };
  }

  async getLowStockProducts(userId: string, limit?: number): Promise<Product[]> {
    const products = await this.productRepository.findLowStock(limit, userId);

    products.forEach((product) => {
      product.updateStockStatus();
    });

    return products;
  }
}
