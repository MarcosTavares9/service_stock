import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '../../shared/core/api-controller.decorator';
import { Roles } from '../../shared/core/roles.decorator';
import { MANAGER_ROLES } from '../auth/user.entity';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiController('Relatórios')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('export/csv')
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Exportar relatório de histórico em formato CSV',
    description: 'Gera e retorna um arquivo CSV contendo o histórico de movimentações de estoque.',
  })
  @ApiResponse({ status: 200, description: 'Arquivo CSV gerado com sucesso' })
  async exportCsv(
    @Res() res: Response,
    @CurrentUser() user: { id: string; email: string },
    @Query('type') type?: string,
    @Query('product_id') product_id?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    const buffer = await this.reportsService.exportCsv({
      type,
      product_id,
      dataInicio,
      dataFim,
      user_id: user.id,
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="relatorio-${new Date().toISOString().split('T')[0]}.csv"`,
    );

    res.send(buffer);
  }

  @Get('export/excel')
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Exportar relatório de histórico em formato Excel',
    description: 'Gera e retorna um arquivo Excel (.xlsx) contendo o histórico.',
  })
  @ApiResponse({ status: 200, description: 'Arquivo Excel gerado com sucesso' })
  async exportExcel(
    @Res() res: Response,
    @CurrentUser() user: { id: string; email: string },
    @Query('type') type?: string,
    @Query('product_id') product_id?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    const buffer = await this.reportsService.exportExcel({
      type,
      product_id,
      dataInicio,
      dataFim,
      user_id: user.id,
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
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Exportar relatório de histórico em formato PDF',
    description: 'Gera e retorna um arquivo PDF contendo o histórico.',
  })
  @ApiResponse({ status: 200, description: 'Arquivo PDF gerado com sucesso' })
  async exportPdf(
    @Res() res: Response,
    @CurrentUser() user: { id: string; email: string },
    @Query('type') type?: string,
    @Query('product_id') product_id?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    const buffer = await this.reportsService.exportPdf({
      type,
      product_id,
      dataInicio,
      dataFim,
      user_id: user.id,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="relatorio-${new Date().toISOString().split('T')[0]}.pdf"`,
    );

    res.send(buffer);
  }
}
