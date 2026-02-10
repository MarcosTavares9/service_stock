import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IProductRepository } from './product.repository';
import { IHistoryRepository } from '../history/history.repository';
import { ICategoryRepository } from '../categories/category.repository';
import { ILocationRepository } from '../locations/location.repository';
import { Product } from './product.entity';
import { History } from '../history/history.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BulkCreateProductDto } from './dto/bulk-create-product.dto';
import { BulkUpdateProductDto } from './dto/bulk-update-product.dto';
import { BulkDeleteProductDto } from './dto/bulk-delete-product.dto';
import { NotFoundException } from '../../shared/core/business.exception';
import { AppConfig } from '../../shared/config/app.config';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
    private readonly dataSource: DataSource,
  ) {}

  async list(): Promise<{ data: Product[] }> {
    const { products } = await this.productRepository.findAll({
      page: 1,
      limit: AppConfig.getMaxListLimit(),
    });

    const serializedProducts = products.map(product => {
      const calculatedStatus = product.calculateStatus();
      
      return {
        uuid: product.uuid,
        name: product.name,
        category_id: product.category_id,
        location_id: product.location_id,
        quantity: product.quantity,
        minimum_stock: product.minimum_stock,
        stock_status: calculatedStatus,
        status: product.status,
        image: product.image || null,
        created_at: product.created_at,
        updated_at: product.updated_at,
      } as Product;
    });

    return { data: serializedProducts };
  }

  async getById(uuid: string) {
    const product = await this.productRepository.findById(uuid);

    if (!product) {
      throw new NotFoundException('Produto');
    }

    product.updateStockStatus();
    return product;
  }

  async create(dto: CreateProductDto, userId?: string): Promise<Product> {
    const product = new Product();
    product.name = dto.name;
    product.category_id = dto.category_id;
    product.location_id = dto.location_id;
    product.quantity = dto.quantity;
    product.minimum_stock = dto.minimum_stock;
    product.image = dto.image;
    product.updateStockStatus();

    const createdProduct = await this.productRepository.create(product);

    await this.historyRepository.create({
      type: 'entry',
      product_id: createdProduct.uuid,
      user_id: userId,
      categories_id: createdProduct.category_id,
      locations_id: createdProduct.location_id,
      quantity_changed: dto.quantity,
      previous_quantity: 0,
      new_quantity: dto.quantity,
      observation: 'Produto criado',
    });

    return createdProduct;
  }

  async update(uuid: string, dto: UpdateProductDto, userId?: string) {
    const product = await this.productRepository.findById(uuid);

    if (!product) {
      throw new NotFoundException('Produto');
    }

    const valoresAnteriores = {
      name: product.name,
      category_id: product.category_id,
      location_id: product.location_id,
      quantity: product.quantity,
      minimum_stock: product.minimum_stock,
      image: product.image,
    };

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.category_id !== undefined) product.category_id = dto.category_id;
    if (dto.location_id !== undefined) product.location_id = dto.location_id;
    if (dto.quantity !== undefined) product.quantity = dto.quantity;
    if (dto.minimum_stock !== undefined) product.minimum_stock = dto.minimum_stock;
    if (dto.image !== undefined) product.image = dto.image;

    product.updateStockStatus();

    const updatedProduct = await this.productRepository.update(product);

    let categoriaAnteriorNome: string | null = null;
    let categoriaNovaNome: string | null = null;
    let localizacaoAnteriorNome: string | null = null;
    let localizacaoNovaNome: string | null = null;

    if (dto.category_id !== undefined && dto.category_id !== valoresAnteriores.category_id) {
      if (valoresAnteriores.category_id) {
        const categoriaAnterior = await this.categoryRepository.findById(valoresAnteriores.category_id);
        categoriaAnteriorNome = categoriaAnterior?.name || 'Desconhecida';
      }
      const categoriaNova = await this.categoryRepository.findById(dto.category_id);
      categoriaNovaNome = categoriaNova?.name || 'Desconhecida';
    }

    if (dto.location_id !== undefined && dto.location_id !== valoresAnteriores.location_id) {
      if (valoresAnteriores.location_id) {
        const localizacaoAnterior = await this.locationRepository.findById(valoresAnteriores.location_id);
        localizacaoAnteriorNome = localizacaoAnterior?.name || 'Desconhecida';
      }
      const localizacaoNova = await this.locationRepository.findById(dto.location_id);
      localizacaoNovaNome = localizacaoNova?.name || 'Desconhecida';
    }

    const alteracoes: string[] = [];
    
    if (dto.name !== undefined && dto.name !== valoresAnteriores.name) {
      alteracoes.push(`Nome: "${valoresAnteriores.name}" → "${dto.name}"`);
    }
    
    if (dto.category_id !== undefined && dto.category_id !== valoresAnteriores.category_id) {
      alteracoes.push(`Categoria alterada de "${categoriaAnteriorNome || 'Nenhuma'}" para "${categoriaNovaNome}"`);
    }
    
    if (dto.location_id !== undefined && dto.location_id !== valoresAnteriores.location_id) {
      alteracoes.push(`Localização alterada de "${localizacaoAnteriorNome || 'Nenhuma'}" para "${localizacaoNovaNome}"`);
    }
    
    if (dto.quantity !== undefined && dto.quantity !== valoresAnteriores.quantity) {
      alteracoes.push(`Quantidade: ${valoresAnteriores.quantity} → ${dto.quantity}`);
    }
    
    if (dto.minimum_stock !== undefined && dto.minimum_stock !== valoresAnteriores.minimum_stock) {
      alteracoes.push(`Estoque mínimo: ${valoresAnteriores.minimum_stock} → ${dto.minimum_stock}`);
    }
    
    if (dto.image !== undefined && dto.image !== valoresAnteriores.image) {
      alteracoes.push(`Imagem alterada`);
    }

    if (alteracoes.length > 0) {
      const quantidadeMudou = dto.quantity !== undefined && dto.quantity !== valoresAnteriores.quantity;
      
      await this.historyRepository.create({
        type: 'adjustment',
        product_id: updatedProduct.uuid,
        user_id: userId,
        categories_id: updatedProduct.category_id,
        locations_id: updatedProduct.location_id,
        quantity_changed: quantidadeMudou ? dto.quantity! - valoresAnteriores.quantity : 0,
        previous_quantity: valoresAnteriores.quantity,
        new_quantity: updatedProduct.quantity,
        observation: `Produto atualizado. Alterações: ${alteracoes.join('; ')}`,
      });
    }

    return updatedProduct;
  }

  async delete(uuid: string, userId?: string) {
    const product = await this.productRepository.findById(uuid);

    if (!product) {
      throw new NotFoundException('Produto');
    }

    // Transação garante atomicidade: ou ambas operações funcionam, ou nenhuma
    await this.dataSource.transaction(async (manager) => {
      const historyRecord = manager.create(History, {
        type: 'exit',
        product_id: product.uuid,
        user_id: userId,
        categories_id: product.category_id,
        locations_id: product.location_id,
        quantity_changed: -product.quantity,
        previous_quantity: product.quantity,
        new_quantity: 0,
        observation: 'Produto deletado',
      });
      await manager.save(historyRecord);
      await manager.delete(Product, { uuid });
    });

    return { message: 'Produto deletado com sucesso' };
  }

  async bulkCreate(dto: BulkCreateProductDto, userId?: string) {
    const products = dto.products.map((p) => {
      const product = new Product();
      product.name = p.name;
      product.category_id = p.category_id;
      product.location_id = p.location_id;
      product.quantity = p.quantity;
      product.minimum_stock = p.minimum_stock;
      product.image = p.image;
      product.updateStockStatus();
      return product;
    });

    const result = await this.productRepository.createBulk(products);

    for (const product of result.data) {
      await this.historyRepository.create({
        type: 'entry',
        product_id: product.uuid,
        user_id: userId,
        categories_id: product.category_id,
        locations_id: product.location_id,
        quantity_changed: product.quantity,
        previous_quantity: 0,
        new_quantity: product.quantity,
        observation: 'Produto criado em lote',
      });
    }

    return result;
  }

  async bulkUpdate(dto: BulkUpdateProductDto, userId?: string) {
    const results = {
      updated: [] as string[],
      failed: [] as Array<{ id: string; error: string }>,
    };

    for (const item of dto.products) {
      try {
        const product = await this.productRepository.findById(item.id);
        
        if (!product) {
          results.failed.push({ id: item.id, error: 'Produto não encontrado' });
          continue;
        }

        if (item.name !== undefined) product.name = item.name;
        if (item.category_id !== undefined) product.category_id = item.category_id;
        if (item.location_id !== undefined) product.location_id = item.location_id;
        if (item.quantity !== undefined) product.quantity = item.quantity;
        if (item.minimum_stock !== undefined) product.minimum_stock = item.minimum_stock;
        if (item.image !== undefined) product.image = item.image;

        product.updateStockStatus();
        const updatedProduct = await this.productRepository.update(product);
        
        await this.historyRepository.create({
          type: 'adjustment',
          product_id: updatedProduct.uuid,
          user_id: userId,
          categories_id: updatedProduct.category_id,
          locations_id: updatedProduct.location_id,
          quantity_changed: item.quantity !== undefined && item.quantity !== product.quantity 
            ? item.quantity - product.quantity 
            : 0,
          previous_quantity: product.quantity,
          new_quantity: updatedProduct.quantity,
          observation: 'Produto atualizado em lote',
        });
        
        results.updated.push(item.id);
      } catch (error) {
        results.failed.push({ 
          id: item.id, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        });
      }
    }

    return {
      updated: results.updated.length,
      failed: results.failed.length,
      details: results,
    };
  }

  async bulkDelete(dto: BulkDeleteProductDto, userId?: string) {
    const results = {
      deleted: [] as string[],
      failed: [] as Array<{ id: string; error: string }>,
    };

    for (const id of dto.ids) {
      try {
        const product = await this.productRepository.findById(id);
        
        if (!product) {
          results.failed.push({ id, error: 'Produto não encontrado' });
          continue;
        }

        await this.dataSource.transaction(async (manager) => {
          const historyRecord = manager.create(History, {
            type: 'exit',
            product_id: product.uuid,
            user_id: userId,
            categories_id: product.category_id,
            locations_id: product.location_id,
            quantity_changed: -product.quantity,
            previous_quantity: product.quantity,
            new_quantity: 0,
            observation: 'Produto deletado em lote',
          });
          await manager.save(historyRecord);
          await manager.delete(Product, { uuid: id });
        });

        results.deleted.push(id);
      } catch (error) {
        results.failed.push({ 
          id, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        });
      }
    }

    return {
      deleted: results.deleted.length,
      failed: results.failed.length,
      details: results,
    };
  }
}
