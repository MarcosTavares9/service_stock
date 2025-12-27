import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@domain/products/entities/product.entity';
import { ProductsController } from './controllers/products.controller';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductUseCase } from '@application/products/use-cases/create-product.use-case';
import { GetProductUseCase } from '@application/products/use-cases/get-product.use-case';
import { ListProductsUseCase } from '@application/products/use-cases/list-products.use-case';
import { UpdateProductUseCase } from '@application/products/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '@application/products/use-cases/delete-product.use-case';
import { BulkCreateProductsUseCase } from '@application/products/use-cases/bulk-create-products.use-case';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), HistoryModule],
  controllers: [ProductsController],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    CreateProductUseCase,
    GetProductUseCase,
    ListProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    BulkCreateProductsUseCase,
  ],
  exports: ['IProductRepository'],
})
export class ProductsModule {}

