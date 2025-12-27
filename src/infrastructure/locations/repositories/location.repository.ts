import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '@domain/locations/entities/location.entity';
import { ILocationRepository } from '@domain/locations/ports/location.repository.port';

@Injectable()
export class LocationRepository implements ILocationRepository {
  constructor(
    @InjectRepository(Location)
    private readonly repository: Repository<Location>,
  ) {}

  async findById(id: string): Promise<Location | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(params?: { ativo?: boolean }): Promise<Location[]> {
    const queryBuilder = this.repository.createQueryBuilder('location');

    if (params?.ativo !== undefined) {
      queryBuilder.where('location.ativo = :ativo', { ativo: params.ativo });
    }

    return queryBuilder.orderBy('location.nome', 'ASC').getMany();
  }

  async findByName(nome: string): Promise<Location | null> {
    return this.repository.findOne({ where: { nome } });
  }

  async create(location: Location): Promise<Location> {
    return this.repository.save(location);
  }

  async update(location: Location): Promise<Location> {
    return this.repository.save(location);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

