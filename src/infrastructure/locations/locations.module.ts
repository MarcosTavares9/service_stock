import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '@domain/locations/entities/location.entity';
import { LocationsController } from './controllers/locations.controller';
import { LocationRepository } from './repositories/location.repository';
import { CreateLocationUseCase } from '@application/locations/use-cases/create-location.use-case';
import { ListLocationsUseCase } from '@application/locations/use-cases/list-locations.use-case';
import { GetLocationUseCase } from '@application/locations/use-cases/get-location.use-case';
import { UpdateLocationUseCase } from '@application/locations/use-cases/update-location.use-case';
import { DeleteLocationUseCase } from '@application/locations/use-cases/delete-location.use-case';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), forwardRef(() => ProductsModule)],
  controllers: [LocationsController],
  providers: [
    {
      provide: 'ILocationRepository',
      useClass: LocationRepository,
    },
    CreateLocationUseCase,
    ListLocationsUseCase,
    GetLocationUseCase,
    UpdateLocationUseCase,
    DeleteLocationUseCase,
  ],
  exports: ['ILocationRepository'],
})
export class LocationsModule {}

