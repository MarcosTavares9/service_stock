import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '@domain/products/ports/product.repository.port';
import { IHistoryRepository } from '@domain/history/ports/history.repository.port';
import { BulkCreateProductDto } from '../dto/bulk-create-product.dto';
import { Product } from '@domain/products/entities/product.entity';
import { HistoryType } from '@domain/history/entities/history.entity';

@Injectable()
export class BulkCreateProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async execute(dto: BulkCreateProductDto, userId: string) {
    const products = dto.products.map((p) => {
      const product = new Product();
      product.nome = p.nome;
      product.categoria = p.categoria;
      product.quantidade = p.quantidade;
      product.estoqueMinimo = p.estoqueMinimo;
      product.localizacao = p.localizacao;
      product.imagem = p.imagem;
      product.updateStatus();
      return product;
    });

    const result = await this.productRepository.createBulk(products);

    // Registrar no histórico
    for (const product of result.data) {
      await this.historyRepository.create({
        tipo: HistoryType.CRIACAO,
        produto: product.nome,
        categoria: product.categoria,
        quantidade: product.quantidade,
        usuario: userId,
        observacao: 'Produto criado em lote',
      });
    }

    return result;
  }
}

