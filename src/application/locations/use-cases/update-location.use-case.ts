import { Injectable, Inject } from '@nestjs/common';
import { ILocationRepository } from '@domain/locations/ports/location.repository.port';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { NotFoundException, ConflictException } from '@shared/exceptions/business.exception';

@Injectable()
export class UpdateLocationUseCase {
  constructor(
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
  ) {}

  async execute(id: string, dto: UpdateLocationDto) {
    const location = await this.locationRepository.findById(id);

    if (!location) {
      throw new NotFoundException('Localização');
    }

    if (dto.nome && dto.nome !== location.nome) {
      const existingLocation = await this.locationRepository.findByName(dto.nome);
      if (existingLocation) {
        throw new ConflictException('Nome de localização já existe');
      }
      location.nome = dto.nome;
    }

    if (dto.descricao !== undefined) {
      location.descricao = dto.descricao;
    }

    if (dto.ativo !== undefined) {
      location.ativo = dto.ativo;
    }

    return this.locationRepository.update(location);
  }
}

