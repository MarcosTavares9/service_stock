import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@domain/categories/entities/category.entity';
import { CategoriesController } from './controllers/categories.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryUseCase } from '@application/categories/use-cases/create-category.use-case';
import { ListCategoriesUseCase } from '@application/categories/use-cases/list-categories.use-case';
import { GetCategoryUseCase } from '@application/categories/use-cases/get-category.use-case';
import { UpdateCategoryUseCase } from '@application/categories/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '@application/categories/use-cases/delete-category.use-case';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), forwardRef(() => ProductsModule)],
  controllers: [CategoriesController],
  providers: [
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    GetCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
  exports: ['ICategoryRepository'],
})
export class CategoriesModule {}

