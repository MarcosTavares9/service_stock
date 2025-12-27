import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '@domain/products/ports/product.repository.port';
import { IHistoryRepository } from '@domain/history/ports/history.repository.port';
import { Product } from '@domain/products/entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { HistoryType } from '@domain/history/entities/history.entity';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async execute(dto: CreateProductDto, userId: string): Promise<Product> {
    const product = new Product();
    product.nome = dto.nome;
    product.categoria = dto.categoria;
    product.quantidade = dto.quantidade;
    product.estoqueMinimo = dto.estoqueMinimo;
    product.localizacao = dto.localizacao;
    product.imagem = dto.imagem;
    product.updateStatus();

    const createdProduct = await this.productRepository.create(product);

    // Registrar no histórico
    await this.historyRepository.create({
      tipo: HistoryType.CRIACAO,
      produto: createdProduct.nome,
      categoria: createdProduct.categoria,
      quantidade: createdProduct.quantidade,
      usuario: userId,
      observacao: 'Produto criado',
    });

    return createdProduct;
  }
}

