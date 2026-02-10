import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { LocationRepository } from './location.repository';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), forwardRef(() => ProductsModule)],
  controllers: [LocationsController],
  providers: [
    {
      provide: 'ILocationRepository',
      useClass: LocationRepository,
    },
    LocationsService,
  ],
  exports: ['ILocationRepository'],
})
export class LocationsModule {}
