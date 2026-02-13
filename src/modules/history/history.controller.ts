import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '../../shared/core/api-controller.decorator';
import { HistoryService } from './history.service';
import {
  EXAMPLE_UUID,
  EXAMPLE_UUID_2,
  EXAMPLE_UUID_3,
  EXAMPLE_NAME,
  EXAMPLE_LAST_NAME,
  EXAMPLE_EMAIL,
} from '../../shared/utils/example-values';

@ApiController('Histórico')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todo o histórico de movimentações',
    description:
      'Retorna uma lista completa de todas as movimentações de estoque registradas no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de histórico retornada com sucesso',
    example: {
      data: [
        {
          uuid: EXAMPLE_UUID,
          type: 'adjustment',
          product_id: EXAMPLE_UUID_2,
          user_id: EXAMPLE_UUID_3,
          quantity_changed: 5,
          previous_quantity: 10,
          new_quantity: 15,
          observation: 'Ajuste de estoque realizado',
          status: 'true',
          created_at: '2026-01-11T02:30:00.000Z',
          user: {
            id: EXAMPLE_UUID_3,
            firstName: EXAMPLE_NAME,
            lastName: EXAMPLE_LAST_NAME,
            email: EXAMPLE_EMAIL,
          },
          product: {
            uuid: EXAMPLE_UUID_2,
            name: 'Notebook Dell',
          },
        },
      ],
    },
  })
  async list(
    @Query('type') type?: string,
    @Query('product_id') product_id?: string,
    @Query('user_id') user_id?: string,
  ) {
    return this.historyService.list();
  }
}
