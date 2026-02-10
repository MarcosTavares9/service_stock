import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './history.entity';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

export interface CreateHistoryDto {
  type: string;
  product_id?: string;
  user_id?: string;
  categories_id?: string;
  locations_id?: string;
  quantity_changed: number;
  previous_quantity?: number;
  new_quantity?: number;
  observation?: string;
}

export interface IHistoryRepository {
  create(dto: CreateHistoryDto): Promise<History>;
  findAll(params: {
    page: number;
    limit: number;
    type?: string;
    product_id?: string;
    user_id?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<{ history: History[]; total: number }>;
}

@Injectable()
export class HistoryRepository implements IHistoryRepository {
  constructor(
    @InjectRepository(History)
    private readonly repository: Repository<History>,
  ) {}

  async create(dto: CreateHistoryDto): Promise<History> {
    const history = new History();
    history.type = dto.type;
    history.product_id = dto.product_id;
    history.user_id = dto.user_id;
    history.categories_id = dto.categories_id;
    history.locations_id = dto.locations_id;
    history.quantity_changed = dto.quantity_changed;
    history.previous_quantity = dto.previous_quantity;
    history.new_quantity = dto.new_quantity;
    history.observation = dto.observation;
    history.status = EntityStatus.ACTIVE;

    return this.repository.save(history);
  }

  async findAll(params: {
    page: number;
    limit: number;
    type?: string;
    product_id?: string;
    user_id?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<{ history: History[]; total: number }> {
    const { page, limit, type, product_id, user_id, dataInicio, dataFim } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('history');

    queryBuilder.where('history.status != :blocked', { blocked: EntityStatus.BLOCKED });

    if (type) {
      queryBuilder.andWhere('history.type = :type', { type });
    }

    if (product_id) {
      queryBuilder.andWhere('history.product_id = :product_id', { product_id });
    }

    if (user_id) {
      queryBuilder.andWhere('history.user_id = :user_id', { user_id });
    }

    if (dataInicio && dataFim) {
      queryBuilder.andWhere('history.created_at BETWEEN :dataInicio AND :dataFim', {
        dataInicio,
        dataFim,
      });
    } else if (dataInicio) {
      queryBuilder.andWhere('history.created_at >= :dataInicio', { dataInicio });
    } else if (dataFim) {
      queryBuilder.andWhere('history.created_at <= :dataFim', { dataFim });
    }

    const [history, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('history.created_at', 'DESC')
      .getManyAndCount();

    const historyWithDetails = await Promise.all(
      history.map(async (h) => {
        const raw = await this.repository
          .createQueryBuilder('history')
          .select([
            'history.uuid as history_uuid',
            'history.type as history_type',
            'history.product_id as history_product_id',
            'history.user_id as history_user_id',
            'history.categories_id as history_categories_id',
            'history.locations_id as history_locations_id',
            'history.quantity_changed as history_quantity_changed',
            'history.previous_quantity as history_previous_quantity',
            'history.new_quantity as history_new_quantity',
            'history.observation as history_observation',
            'history.created_at as history_created_at',
            'user.id as user_id',
            'user.name as user_name',
            'user.email as user_email',
            'product.uuid as product_uuid',
            'product.name as product_name',
          ])
          .leftJoin('users', 'user', 'user.id = history.user_id')
          .leftJoin('products', 'product', 'product.uuid = history.product_id')
          .where('history.uuid = :uuid', { uuid: h.uuid })
          .getRawOne();

        return {
          uuid: h.uuid,
          type: h.type,
          product_id: h.product_id,
          user_id: h.user_id,
          categories_id: h.categories_id,
          locations_id: h.locations_id,
          quantity_changed: h.quantity_changed,
          previous_quantity: h.previous_quantity,
          new_quantity: h.new_quantity,
          observation: h.observation,
          created_at: h.created_at,
          user: raw?.user_id
            ? {
                id: raw.user_id,
                name: raw.user_name,
                email: raw.user_email,
              }
            : null,
          product: raw?.product_uuid
            ? {
                uuid: raw.product_uuid,
                name: raw.product_name,
              }
            : null,
        };
      }),
    );

    return { history: historyWithDetails as any, total };
  }
}
