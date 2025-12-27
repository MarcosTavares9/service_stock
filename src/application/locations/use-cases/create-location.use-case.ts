import { Injectable, Inject } from '@nestjs/common';
import { ILocationRepository } from '@domain/locations/ports/location.repository.port';
import { CreateLocationDto } from '../dto/create-location.dto';
import { Location } from '@domain/locations/entities/location.entity';
import { ConflictException } from '@shared/exceptions/business.exception';

@Injectable()
export class CreateLocationUseCase {
  constructor(
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
  ) {}

  async execute(dto: CreateLocationDto): Promise<Location> {
    const existingLocation = await this.locationRepository.findByName(dto.nome);

    if (existingLocation) {
      throw new ConflictException('Nome de localização já existe');
    }

    const location = new Location();
    location.nome = dto.nome;
    location.descricao = dto.descricao;
    location.ativo = true;

    return this.locationRepository.create(location);
  }
}

