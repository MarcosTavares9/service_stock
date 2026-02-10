import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.entity';
import { HistoryRepository } from './history.repository';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [TypeOrmModule.forFeature([History])],
  controllers: [HistoryController],
  providers: [
    {
      provide: 'IHistoryRepository',
      useClass: HistoryRepository,
    },
    HistoryService,
  ],
  exports: ['IHistoryRepository'],
})
export class HistoryModule {}
