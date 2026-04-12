import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

export interface ILocationRepository {
  findById(uuid: string, userId: string): Promise<Location | null>;
  findAll(params?: { active?: boolean; userId?: string }): Promise<Location[]>;
  findByName(name: string, userId: string): Promise<Location | null>;
  create(location: Location): Promise<Location>;
  update(location: Location): Promise<Location>;
  delete(uuid: string): Promise<void>;
}

@Injectable()
export class LocationRepository implements ILocationRepository {
  constructor(
    @InjectRepository(Location)
    private readonly repository: Repository<Location>,
  ) {}

  async findById(uuid: string, userId: string): Promise<Location | null> {
    return this.repository.findOne({ where: { uuid, user_id: userId } });
  }

  async findAll(params?: { active?: boolean; userId?: string }): Promise<Location[]> {
    const queryBuilder = this.repository.createQueryBuilder('location');
    queryBuilder.where('location.status != :blocked', { blocked: EntityStatus.BLOCKED });

    if (params?.userId) {
      queryBuilder.andWhere('location.user_id = :userId', { userId: params.userId });
    }

    if (params?.active !== undefined) {
      const statusFilter = params.active ? EntityStatus.ACTIVE : EntityStatus.INACTIVE;
      queryBuilder.andWhere('location.status = :status', { status: statusFilter });
    }

    return queryBuilder.orderBy('location.name', 'ASC').getMany();
  }

  async findByName(name: string, userId: string): Promise<Location | null> {
    return this.repository.findOne({ where: { name, user_id: userId } });
  }

  async create(location: Location): Promise<Location> {
    return this.repository.save(location);
  }

  async update(location: Location): Promise<Location> {
    return this.repository.save(location);
  }

  async delete(uuid: string): Promise<void> {
    await this.repository.delete({ uuid });
  }
}
