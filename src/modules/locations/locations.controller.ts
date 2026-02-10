import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '../../shared/core/api-controller.decorator';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';
import { ValidationUtil } from '../../shared/utils/validation.util';
import { EXAMPLE_UUID } from '../../shared/utils/example-values';

@ApiController('Localizações')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as localizações' })
  @ApiResponse({ status: 200, description: 'Lista de localizações retornada com sucesso' })
  async list(@Query('active') active?: string) {
    const activeBool = ValidationUtil.parseBoolean(active);
    return this.locationsService.list(activeBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar localização por UUID' })
  @ApiResponse({ status: 200, description: 'Localização encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Localização não encontrada' })
  async get(@Param('id') id: string) {
    return this.locationsService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova localização' })
  @ApiResponse({ status: 201, description: 'Localização criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos' })
  async create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar localização' })
  @ApiResponse({ status: 200, description: 'Localização atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Localização não encontrada' })
  async update(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.locationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar localização' })
  @ApiResponse({ status: 200, description: 'Localização deletada com sucesso' })
  @ApiResponse({ status: 400, description: 'Não é possível deletar localização com produtos associados' })
  async delete(@Param('id') id: string) {
    return this.locationsService.delete(id);
  }
}
