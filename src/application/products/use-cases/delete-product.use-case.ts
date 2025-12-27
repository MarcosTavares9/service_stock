import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '@domain/products/ports/product.repository.port';
import { IHistoryRepository } from '@domain/history/ports/history.repository.port';
import { NotFoundException } from '@shared/exceptions/business.exception';
import { HistoryType } from '@domain/history/entities/history.entity';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async execute(id: number, userId: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Produto');
    }

    await this.productRepository.delete(id);

    // Registrar no histórico
    await this.historyRepository.create({
      tipo: HistoryType.EXCLUSAO,
      produto: product.nome,
      categoria: product.categoria,
      quantidade: product.quantidade,
      usuario: userId,
      observacao: 'Produto deletado',
    });

    return { message: 'Produto deletado com sucesso' };
  }
}

