import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '../../shared/core/api-controller.decorator';
import { DashboardService } from './dashboard.service';
import { EXAMPLE_UUID, EXAMPLE_UUID_2, EXAMPLE_UUID_3 } from '../../shared/utils/example-values';

@ApiController('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ 
    summary: 'Obter estatísticas gerais do dashboard',
    description: 'Retorna estatísticas consolidadas do sistema.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estatísticas retornadas com sucesso',
    example: {
      totalProducts: 150,
      totalCategories: 12,
      totalLocations: 5,
      lowStockProducts: 8,
      emptyStockProducts: 2
    }
  })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('low-stock')
  @ApiOperation({ 
    summary: 'Listar produtos com estoque baixo',
    description: 'Retorna uma lista de produtos que estão com estoque abaixo do mínimo ou vazio.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de produtos com estoque baixo retornada com sucesso',
    example: [
      {
        uuid: EXAMPLE_UUID,
        name: 'Notebook Dell',
        category_id: EXAMPLE_UUID_2,
        location_id: EXAMPLE_UUID_3,
        quantity: 2,
        minimum_stock: 5,
        stock_status: 'low',
        status: 'true',
        image: null,
        created_at: '2026-01-11T02:30:00.000Z',
        updated_at: '2026-01-11T02:30:00.000Z'
      }
    ]
  })
  async getLowStock(@Query('limit') limit?: number) {
    return this.dashboardService.getLowStockProducts(limit);
  }
}
