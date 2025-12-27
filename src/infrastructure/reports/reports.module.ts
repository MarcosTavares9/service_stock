import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ExportCsvUseCase } from '@application/reports/use-cases/export-csv.use-case';
import { ExportExcelUseCase } from '@application/reports/use-cases/export-excel.use-case';
import { ExportPdfUseCase } from '@application/reports/use-cases/export-pdf.use-case';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [HistoryModule],
  controllers: [ReportsController],
  providers: [ExportCsvUseCase, ExportExcelUseCase, ExportPdfUseCase],
})
export class ReportsModule {}

