import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '@domain/products/ports/product.repository.port';
import { ProductStatus } from '@domain/products/entities/product.entity';

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute() {
    const { products, total } = await this.productRepository.findAll({
      page: 1,
      limit: 10000,
    });

    const totalProdutos = total;
    const produtosBaixoEstoque = products.filter(
      (p) => p.status === ProductStatus.BAIXO || p.status === ProductStatus.VAZIO,
    ).length;

    const totalEstoque = products.reduce((sum, p) => sum + p.quantidade, 0);

    const estatisticasPorStatus = {
      ok: products.filter((p) => p.status === ProductStatus.OK).length,
      baixo: products.filter((p) => p.status === ProductStatus.BAIXO).length,
      vazio: products.filter((p) => p.status === ProductStatus.VAZIO).length,
      total: totalProdutos,
    };

    return {
      totalProdutos,
      produtosBaixoEstoque,
      totalEstoque,
      estatisticasPorStatus,
    };
  }
}

