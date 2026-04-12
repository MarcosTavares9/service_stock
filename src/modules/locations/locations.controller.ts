import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '../../shared/core/api-controller.decorator';
import { Roles } from '../../shared/core/roles.decorator';
import { MANAGER_ROLES, ALL_ROLES } from '../auth/user.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';
import { ValidationUtil } from '../../shared/utils/validation.util';

@ApiController('Localizações')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @Roles(...ALL_ROLES)
  @ApiOperation({
    summary: 'Listar todas as localizações',
    description: 'Retorna lista de localizações do usuário autenticado.',
  })
  @ApiResponse({ status: 200, description: 'Lista de localizações retornada com sucesso' })
  async list(@CurrentUser() user: { id: string }, @Query('active') active?: string) {
    const activeBool = ValidationUtil.parseBoolean(active);
    return this.locationsService.list(user.id, activeBool);
  }

  @Get(':id')
  @Roles(...ALL_ROLES)
  @ApiOperation({
    summary: 'Buscar localização por UUID',
    description: 'Retorna detalhes de uma localização do usuário autenticado.',
  })
  @ApiResponse({ status: 200, description: 'Localização encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Localização não encontrada' })
  async get(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.locationsService.getById(id, user.id);
  }

  @Post()
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Criar nova localização',
    description: 'Cria uma nova localização para o usuário autenticado.',
  })
  @ApiResponse({ status: 201, description: 'Localização criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async create(@Body() dto: CreateLocationDto, @CurrentUser() user: { id: string }) {
    return this.locationsService.create(dto, user.id);
  }

  @Put(':id')
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Atualizar localização',
    description: 'Atualiza informações de uma localização do usuário autenticado.',
  })
  @ApiResponse({ status: 200, description: 'Localização atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Localização não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async update(@Param('id') id: string, @Body() dto: UpdateLocationDto, @CurrentUser() user: { id: string }) {
    return this.locationsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Deletar localização',
    description: 'Remove uma localização do usuário autenticado.',
  })
  @ApiResponse({ status: 200, description: 'Localização deletada com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Não é possível deletar localização com produtos associados',
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async delete(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.locationsService.delete(id, user.id);
  }
}
