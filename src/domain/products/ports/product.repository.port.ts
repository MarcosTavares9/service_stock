import { Product } from '../entities/product.entity';

export interface IProductRepository {
  findById(id: number): Promise<Product | null>;
  findAll(params: {
    page: number;
    limit: number;
    search?: string;
    categoria?: string;
    status?: string;
  }): Promise<{ products: Product[]; total: number }>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
  createBulk(products: Product[]): Promise<{ created: number; failed: number; data: Product[] }>;
  findByCategory(categoryName: string): Promise<Product[]>;
  findByLocation(locationName: string): Promise<Product[]>;
  findLowStock(limit?: number): Promise<Product[]>;
}

