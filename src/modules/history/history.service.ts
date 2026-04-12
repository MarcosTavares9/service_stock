import { Injectable, Inject } from '@nestjs/common';
import { IHistoryRepository } from './history.repository';
import { History } from './history.entity';
import { AppConfig } from '../../shared/config/app.config';
import { ListHistoryDto } from './dto/list-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async list(filters: ListHistoryDto = {}, userId?: string): Promise<{ data: History[] }> {
    const { history } = await this.historyRepository.findAll({
      page: filters.page ?? 1,
      limit: filters.limit ?? AppConfig.getMaxListLimit(),
      type: filters.type,
      product_id: filters.product_id,
      user_id: userId ?? filters.user_id,
      dataInicio: filters.dataInicio,
      dataFim: filters.dataFim,
    });

    return { data: history };
  }
}
