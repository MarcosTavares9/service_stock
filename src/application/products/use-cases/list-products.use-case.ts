import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '@domain/products/ports/product.repository.port';
import { PaginationUtil, PaginationResult } from '@shared/utils/pagination.util';
import { Product } from '@domain/products/entities/product.entity';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoria?: string;
    status?: string;
  }): Promise<PaginationResult<Product>> {
    const { page, limit } = PaginationUtil.normalize({
      page: params.page,
      limit: params.limit,
    });

    const { products, total } = await this.productRepository.findAll({
      page,
      limit,
      search: params.search,
      categoria: params.categoria,
      status: params.status,
    });

    return PaginationUtil.create(products, total, page, limit);
  }
}

