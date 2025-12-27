import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '@shared/decorators/api-controller.decorator';
import { ListHistoryUseCase } from '@application/history/use-cases/list-history.use-case';
import { ListHistoryDto } from '@application/history/dto/list-history.dto';

@ApiController('Histórico')
@Controller('history')
export class HistoryController {
  constructor(private readonly listHistoryUseCase: ListHistoryUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar histórico' })
  @ApiResponse({ status: 200, description: 'Lista de histórico' })
  async list(@Query() query: ListHistoryDto) {
    return this.listHistoryUseCase.execute(query);
  }
}

