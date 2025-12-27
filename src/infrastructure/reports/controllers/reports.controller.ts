import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '@shared/decorators/api-controller.decorator';
import { ExportCsvUseCase } from '@application/reports/use-cases/export-csv.use-case';
import { ExportExcelUseCase } from '@application/reports/use-cases/export-excel.use-case';
import { ExportPdfUseCase } from '@application/reports/use-cases/export-pdf.use-case';
import { HistoryType } from '@domain/history/entities/history.entity';
import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

@ApiController('Relatórios')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly exportCsvUseCase: ExportCsvUseCase,
    private readonly exportExcelUseCase: ExportExcelUseCase,
    private readonly exportPdfUseCase: ExportPdfUseCase,
  ) {}

  @Get('export/csv')
  @ApiOperation({ summary: 'Exportar relatório CSV' })
  @ApiResponse({ status: 200, description: 'Arquivo CSV' })
  async exportCsv(
    @Query('tipo') tipo?: HistoryType,
    @Query('categoria') categoria?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Res() res: Response,
  ) {
    const filename = await this.exportCsvUseCase.execute({
      tipo,
      categoria,
      dataInicio,
      dataFim,
    });

    const filePath = join(process.cwd(), filename);
    const fileContent = readFileSync(filePath);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="relatorio-${new Date().toISOString().split('T')[0]}.csv"`,
    );

    res.send(fileContent);

    // Limpar arquivo temporário
    unlinkSync(filePath);
  }

  @Get('export/excel')
  @ApiOperation({ summary: 'Exportar relatório Excel' })
  @ApiResponse({ status: 200, description: 'Arquivo Excel' })
  async exportExcel(
    @Query('tipo') tipo?: HistoryType,
    @Query('categoria') categoria?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Res() res: Response,
  ) {
    const buffer = await this.exportExcelUseCase.execute({
      tipo,
      categoria,
      dataInicio,
      dataFim,
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="relatorio-${new Date().toISOString().split('T')[0]}.xlsx"`,
    );

    res.send(buffer);
  }

  @Get('export/pdf')
  @ApiOperation({ summary: 'Exportar relatório PDF' })
  @ApiResponse({ status: 200, description: 'Arquivo PDF' })
  async exportPdf(
    @Query('tipo') tipo?: HistoryType,
    @Query('categoria') categoria?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Res() res: Response,
  ) {
    const buffer = await this.exportPdfUseCase.execute({
      tipo,
      categoria,
      dataInicio,
      dataFim,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="relatorio-${new Date().toISOString().split('T')[0]}.pdf"`,
    );

    res.send(buffer);
  }
}

