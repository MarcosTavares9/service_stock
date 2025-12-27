import { Injectable, Inject } from '@nestjs/common';
import { ILocationRepository } from '@domain/locations/ports/location.repository.port';
import { NotFoundException } from '@shared/exceptions/business.exception';

@Injectable()
export class GetLocationUseCase {
  constructor(
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
  ) {}

  async execute(id: string) {
    const location = await this.locationRepository.findById(id);

    if (!location) {
      throw new NotFoundException('Localização');
    }

    return location;
  }
}

