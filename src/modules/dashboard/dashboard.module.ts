import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [ProductsModule, CategoriesModule, LocationsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
