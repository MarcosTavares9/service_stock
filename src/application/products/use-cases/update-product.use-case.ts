import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '@domain/products/ports/product.repository.port';
import { IHistoryRepository } from '@domain/history/ports/history.repository.port';
import { UpdateProductDto } from '../dto/update-product.dto';
import { NotFoundException } from '@shared/exceptions/business.exception';
import { HistoryType } from '@domain/history/entities/history.entity';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async execute(id: number, dto: UpdateProductDto, userId: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Produto');
    }

    const quantidadeAnterior = product.quantidade;

    if (dto.nome !== undefined) product.nome = dto.nome;
    if (dto.categoria !== undefined) product.categoria = dto.categoria;
    if (dto.quantidade !== undefined) product.quantidade = dto.quantidade;
    if (dto.estoqueMinimo !== undefined) product.estoqueMinimo = dto.estoqueMinimo;
    if (dto.localizacao !== undefined) product.localizacao = dto.localizacao;
    if (dto.imagem !== undefined) product.imagem = dto.imagem;

    product.updateStatus();

    const updatedProduct = await this.productRepository.update(product);

    // Registrar no histórico
    await this.historyRepository.create({
      tipo: HistoryType.EDICAO,
      produto: updatedProduct.nome,
      categoria: updatedProduct.categoria,
      quantidade: updatedProduct.quantidade,
      quantidadeAnterior,
      quantidadeNova: updatedProduct.quantidade,
      usuario: userId,
      observacao: 'Produto atualizado',
    });

    return updatedProduct;
  }
}

