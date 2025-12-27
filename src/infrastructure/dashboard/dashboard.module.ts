import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { GetDashboardStatsUseCase } from '@application/dashboard/use-cases/get-dashboard-stats.use-case';
import { GetLowStockProductsUseCase } from '@application/dashboard/use-cases/get-low-stock-products.use-case';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [DashboardController],
  providers: [GetDashboardStatsUseCase, GetLowStockProductsUseCase],
})
export class DashboardModule {}

