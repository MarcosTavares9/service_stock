import { Injectable, Inject } from '@nestjs/common';
import { ILocationRepository } from './location.repository';
import { IProductRepository } from '../products/product.repository';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './location.entity';
import {
  NotFoundException,
  ConflictException,
  BusinessException,
} from '../../shared/core/business.exception';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

@Injectable()
export class LocationsService {
  constructor(
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async list(userId: string, active?: boolean): Promise<{ data: Location[] }> {
    const locations = await this.locationRepository.findAll({ active, userId });
    return { data: locations };
  }

  async getById(id: string, userId: string) {
    const location = await this.locationRepository.findById(id, userId);
    if (!location) {
      throw new NotFoundException('Localização');
    }
    return location;
  }

  async create(dto: CreateLocationDto, userId: string): Promise<Location> {
    const existingLocation = await this.locationRepository.findByName(dto.name, userId);
    if (existingLocation) {
      throw new ConflictException('Nome de localização já existe');
    }

    const location = new Location();
    location.name = dto.name;
    location.description = dto.description;
    location.status = EntityStatus.ACTIVE;
    location.user_id = userId;

    return this.locationRepository.create(location);
  }

  async update(id: string, dto: UpdateLocationDto, userId: string) {
    const location = await this.locationRepository.findById(id, userId);
    if (!location) {
      throw new NotFoundException('Localização');
    }

    if (dto.name && dto.name !== location.name) {
      const existingLocation = await this.locationRepository.findByName(dto.name, userId);
      if (existingLocation) {
        throw new ConflictException('Nome de localização já existe');
      }
      location.name = dto.name;
    }

    if (dto.description !== undefined) {
      location.description = dto.description;
    }

    if (dto.status !== undefined) {
      location.status = dto.status;
    }

    return this.locationRepository.update(location);
  }

  async delete(id: string, userId: string) {
    const location = await this.locationRepository.findById(id, userId);
    if (!location) {
      throw new NotFoundException('Localização');
    }

    const products = await this.productRepository.findByLocation(location.uuid);
    if (products.length > 0) {
      throw new BusinessException('Não é possível deletar localização com produtos associados');
    }

    await this.locationRepository.delete(id);
    return { message: 'Localização deletada com sucesso' };
  }
}
