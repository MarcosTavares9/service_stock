import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '../../shared/core/api-controller.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';
import { EXAMPLE_UUID } from '../../shared/utils/example-values';

@ApiController('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas as categorias',
    description:
      'Retorna uma lista completa de todas as categorias cadastradas no sistema, incluindo nome e ícone associado.',
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
  async list() {
    return this.categoriesService.list();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar categoria por UUID',
    description:
      'Retorna os detalhes completos de uma categoria específica identificada pelo seu UUID.',
  })
  @ApiResponse({ status: 200, description: 'Categoria encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada com o UUID fornecido' })
  async get(@Param('id') id: string) {
    return this.categoriesService.getById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar nova categoria',
    description: 'Cria uma nova categoria no sistema com nome e ícone.',
  })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos ou categoria já existe' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar categoria',
    description: 'Atualiza as informações de uma categoria existente.',
  })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada com o UUID fornecido' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar categoria',
    description:
      'Remove uma categoria do sistema. Só é permitida se não houver produtos associados.',
  })
  @ApiResponse({ status: 200, description: 'Categoria deletada com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Não é possível deletar categoria com produtos associados',
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
