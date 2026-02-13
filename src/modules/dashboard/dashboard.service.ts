import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '../products/product.repository';
import { ICategoryRepository } from '../categories/category.repository';
import { ILocationRepository } from '../locations/location.repository';
import { Product, ProductStatus } from '../products/product.entity';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
  ) {}

  async getStats() {
    const { products, total } = await this.productRepository.findAll({
      page: 1,
      limit: 10000,
    });

    products.forEach((product) => {
      product.updateStockStatus();
    });

    const totalProducts = total;
    const lowStockProducts = products.filter((p) => p.stock_status === ProductStatus.LOW).length;
    const emptyStockProducts = products.filter(
      (p) => p.stock_status === ProductStatus.EMPTY,
    ).length;

    const [categories, locations] = await Promise.all([
      this.categoryRepository.findAll(),
      this.locationRepository.findAll({ active: true }),
    ]);

    const totalCategories = categories.length;
    const totalLocations = locations.length;

    return {
      totalProducts,
      totalCategories,
      totalLocations,
      lowStockProducts,
      emptyStockProducts,
    };
  }

  async getLowStockProducts(limit?: number): Promise<Product[]> {
    const products = await this.productRepository.findLowStock(limit);

    products.forEach((product) => {
      product.updateStockStatus();
    });

    return products;
  }
}
