import { Injectable, Inject } from '@nestjs/common';
import { ILocationRepository } from '@domain/locations/ports/location.repository.port';
import { Location } from '@domain/locations/entities/location.entity';

@Injectable()
export class ListLocationsUseCase {
  constructor(
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
  ) {}

  async execute(ativo?: boolean): Promise<{ data: Location[] }> {
    const locations = await this.locationRepository.findAll({ ativo });
    return { data: locations };
  }
}

