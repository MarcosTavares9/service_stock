import { Injectable, Inject } from '@nestjs/common';
import { IHistoryRepository } from '@domain/history/ports/history.repository.port';
import { PaginationUtil, PaginationResult } from '@shared/utils/pagination.util';
import { History } from '@domain/history/entities/history.entity';
import { ListHistoryDto } from '../dto/list-history.dto';

@Injectable()
export class ListHistoryUseCase {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async execute(dto: ListHistoryDto): Promise<PaginationResult<History>> {
    const { page, limit } = PaginationUtil.normalize({
      page: dto.page,
      limit: dto.limit,
    });

    const { history, total } = await this.historyRepository.findAll({
      page,
      limit,
      tipo: dto.tipo,
      categoria: dto.categoria,
      produto: dto.produto,
      usuario: dto.usuario,
      dataInicio: dto.dataInicio,
      dataFim: dto.dataFim,
    });

    return PaginationUtil.create(history, total, page, limit);
  }
}

