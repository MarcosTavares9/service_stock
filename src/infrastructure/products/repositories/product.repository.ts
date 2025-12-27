import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Product, ProductStatus } from '@domain/products/entities/product.entity';
import { IProductRepository } from '@domain/products/ports/product.repository.port';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findById(id: number): Promise<Product | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    categoria?: string;
    status?: string;
  }): Promise<{ products: Product[]; total: number }> {
    const { page, limit, search, categoria, status } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('product');

    if (search) {
      queryBuilder.where(
        '(product.nome ILIKE :search OR product.localizacao ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (categoria) {
      queryBuilder.andWhere('product.categoria = :categoria', { categoria });
    }

    if (status) {
      queryBuilder.andWhere('product.status = :status', { status });
    }

    const [products, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    return { products, total };
  }

  async create(product: Product): Promise<Product> {
    return this.repository.save(product);
  }

  async update(product: Product): Promise<Product> {
    return this.repository.save(product);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
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

  async findByCategory(categoryName: string): Promise<Product[]> {
    return this.repository.find({ where: { categoria: categoryName } });
  }

  async findByLocation(locationName: string): Promise<Product[]> {
    return this.repository.find({ where: { localizacao: locationName } });
  }

  async findLowStock(limit?: number): Promise<Product[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('product')
      .where('product.status IN (:...statuses)', {
        statuses: [ProductStatus.BAIXO, ProductStatus.VAZIO],
      })
      .orderBy('product.quantidade', 'ASC');

    if (limit) {
      queryBuilder.take(limit);
    }

    return queryBuilder.getMany();
  }
}

