import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from '@domain/history/entities/history.entity';
import { HistoryRepository } from './repositories/history.repository';
import { HistoryController } from './controllers/history.controller';
import { ListHistoryUseCase } from '@application/history/use-cases/list-history.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([History])],
  controllers: [HistoryController],
  providers: [
    {
      provide: 'IHistoryRepository',
      useClass: HistoryRepository,
    },
    ListHistoryUseCase,
  ],
  exports: ['IHistoryRepository'],
})
export class HistoryModule {}

