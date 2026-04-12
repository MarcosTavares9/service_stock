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

    if (history.length === 0) {
      return { history: [], total };
    }

    const uuids = history.map((h) => h.uuid);

    const details = await this.repository
      .createQueryBuilder('history')
      .select([
        'history.uuid as history_uuid',
        'user.id as user_id',
        'user.name as user_name',
        'user.email as user_email',
        'product.uuid as product_uuid',
        'product.name as product_name',
      ])
      .leftJoin('users', 'user', 'user.id = history.user_id')
      .leftJoin('products', 'product', 'product.uuid = history.product_id')
      .where('history.uuid IN (:...uuids)', { uuids })
      .getRawMany();

    const detailMap = new Map(details.map((d) => [d.history_uuid, d]));

    const historyWithDetails = history.map((h) => {
      const detail = detailMap.get(h.uuid);
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
        user: detail?.user_id
          ? { id: detail.user_id, name: detail.user_name, email: detail.user_email }
          : null,
        product: detail?.product_uuid
          ? { uuid: detail.product_uuid, name: detail.product_name }
          : null,
      };
    });

    return { history: historyWithDetails as any, total };
  }
}
