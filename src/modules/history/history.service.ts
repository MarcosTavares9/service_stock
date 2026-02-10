import { Injectable, Inject } from '@nestjs/common';
import { IHistoryRepository } from './history.repository';
import { History } from './history.entity';
import { AppConfig } from '../../shared/config/app.config';

@Injectable()
export class HistoryService {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async list(): Promise<{ data: History[] }> {
    const { history } = await this.historyRepository.findAll({
      page: 1,
      limit: AppConfig.getMaxListLimit(),
    });

    return { data: history };
  }
}
