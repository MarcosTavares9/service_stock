import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '../../shared/core/api-controller.decorator';
import { Roles } from '../../shared/core/roles.decorator';
import { MANAGER_ROLES, ALL_ROLES } from '../auth/user.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';
import { EXAMPLE_UUID } from '../../shared/utils/example-values';

@ApiController('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles(...ALL_ROLES)
  @ApiOperation({
    summary: 'Listar todas as categorias',
    description: 'Retorna lista de categorias do usuário autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    example: {
      data: [
        {
          uuid: EXAMPLE_UUID,
          name: 'Informática',
          icon_name: 'laptop',
          status: 'true',
          created_at: '2026-01-11T02:30:00.000Z',
          updated_at: '2026-01-11T02:30:00.000Z',
        },
      ],
    },
  })
  async list(@CurrentUser() user: { id: string }) {
    return this.categoriesService.list(user.id);
  }

  @Get(':id')
  @Roles(...ALL_ROLES)
  @ApiOperation({
    summary: 'Buscar categoria por UUID',
    description: 'Retorna detalhes de uma categoria do usuário autenticado.',
  })
  @ApiResponse({ status: 200, description: 'Categoria encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada com o UUID fornecido' })
  async get(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.categoriesService.getById(id, user.id);
  }

  @Post()
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Criar nova categoria',
    description: 'Cria uma nova categoria para o usuário autenticado.',
  })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos ou categoria já existe' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async create(@Body() dto: CreateCategoryDto, @CurrentUser() user: { id: string }) {
    return this.categoriesService.create(dto, user.id);
  }

  @Put(':id')
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Atualizar categoria',
    description: 'Atualiza informações de uma categoria do usuário autenticado.',
  })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada com o UUID fornecido' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto, @CurrentUser() user: { id: string }) {
    return this.categoriesService.update(id, dto, user.id);
  }

  @Delete(':id')
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Deletar categoria',
    description: 'Remove uma categoria do usuário autenticado.',
  })
  @ApiResponse({ status: 200, description: 'Categoria deletada com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Não é possível deletar categoria com produtos associados',
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async delete(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.categoriesService.delete(id, user.id);
  }
}
