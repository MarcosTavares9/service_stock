import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '@shared/decorators/api-controller.decorator';
import { GetDashboardStatsUseCase } from '@application/dashboard/use-cases/get-dashboard-stats.use-case';
import { GetLowStockProductsUseCase } from '@application/dashboard/use-cases/get-low-stock-products.use-case';

@ApiController('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase,
    private readonly getLowStockProductsUseCase: GetLowStockProductsUseCase,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas gerais' })
  @ApiResponse({ status: 200, description: 'Estatísticas do dashboard' })
  async getStats() {
    return this.getDashboardStatsUseCase.execute();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Produtos com estoque baixo' })
  @ApiResponse({ status: 200, description: 'Lista de produtos com estoque baixo' })
  async getLowStock(@Query('limit') limit?: number) {
    return this.getLowStockProductsUseCase.execute(limit);
  }
}

