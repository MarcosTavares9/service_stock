import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './product.entity';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

export interface IProductRepository {
  findById(uuid: string): Promise<Product | null>;
  findAll(params: {
    page: number;
    limit: number;
    search?: string;
    category_id?: string;
    status?: string;
  }): Promise<{ products: Product[]; total: number }>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(uuid: string): Promise<void>;
  createBulk(products: Product[]): Promise<{ created: number; failed: number; data: Product[] }>;
  findByCategory(categoryId: string): Promise<Product[]>;
  findByLocation(locationId: string): Promise<Product[]>;
  findLowStock(limit?: number): Promise<Product[]>;
}

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findById(uuid: string): Promise<Product | null> {
    return this.repository.findOne({ where: { uuid } });
  }

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    category_id?: string;
    status?: string;
  }): Promise<{ products: Product[]; total: number }> {
    const { page, limit, search, category_id, status } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('product');

    queryBuilder.where('product.status != :blocked', { blocked: EntityStatus.BLOCKED });

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.location_id IN (SELECT uuid FROM locations WHERE name ILIKE :search))',
        { search: `%${search}%` },
      );
    }

    if (category_id) {
      queryBuilder.andWhere('product.category_id = :category_id', { category_id });
    }

    if (status) {
      queryBuilder.andWhere('product.stock_status = :status', { status });
    }

    const [products, total] = await queryBuilder
      .select([
        'product.uuid',
        'product.name',
        'product.category_id',
        'product.location_id',
        'product.quantity',
        'product.minimum_stock',
        'product.stock_status',
        'product.status',
        'product.image',
        'product.created_at',
        'product.updated_at',
      ])
      .skip(skip)
      .take(limit)
      .orderBy('product.created_at', 'DESC')
      .getManyAndCount();

    products.forEach((product) => {
      product.updateStockStatus();
    });

    return { products, total };
  }

  async create(product: Product): Promise<Product> {
    return this.repository.save(product);
  }

  async update(product: Product): Promise<Product> {
    return this.repository.save(product);
  }

  async delete(uuid: string): Promise<void> {
    await this.repository.delete({ uuid });
  }

  async createBulk(
    products: Product[],
  ): Promise<{ created: number; failed: number; data: Product[] }> {
    const created: Product[] = [];
    let failed = 0;

    for (const product of products) {
      try {
        const saved = await this.repository.save(product);
        created.push(saved);
      } catch (error) {
        failed++;
      }
    }

    return {
      created: created.length,
      failed,
      data: created,
    };
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.repository.find({ where: { category_id: categoryId } });
  }

  async findByLocation(locationId: string): Promise<Product[]> {
    return this.repository.find({ where: { location_id: locationId } });
  }

  async findLowStock(limit?: number): Promise<Product[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('product')
      .select([
        'product.uuid',
        'product.name',
        'product.category_id',
        'product.location_id',
        'product.quantity',
        'product.minimum_stock',
        'product.status',
        'product.image',
        'product.created_at',
        'product.updated_at',
      ])
      .orderBy('product.quantity', 'ASC');

    if (limit) {
      queryBuilder.take(limit);
    }

    const products = await queryBuilder.getMany();

    products.forEach((product) => {
      product.updateStockStatus();
    });

    return products.filter(
      (p) => p.stock_status === ProductStatus.LOW || p.stock_status === ProductStatus.EMPTY,
    );
  }
}
