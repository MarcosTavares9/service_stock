import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '@shared/decorators/api-controller.decorator';
import { CreateCategoryDto } from '@application/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@application/categories/dto/update-category.dto';
import { CreateCategoryUseCase } from '@application/categories/use-cases/create-category.use-case';
import { ListCategoriesUseCase } from '@application/categories/use-cases/list-categories.use-case';
import { GetCategoryUseCase } from '@application/categories/use-cases/get-category.use-case';
import { UpdateCategoryUseCase } from '@application/categories/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '@application/categories/use-cases/delete-category.use-case';

@ApiController('Categorias')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorias' })
  @ApiResponse({ status: 200, description: 'Lista de categorias' })
  async list() {
    return this.listCategoriesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.getCategoryUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar categoria' })
  @ApiResponse({ status: 201, description: 'Categoria criada' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.createCategoryUseCase.execute(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiResponse({ status: 200, description: 'Categoria atualizada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.updateCategoryUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar categoria' })
  @ApiResponse({ status: 200, description: 'Categoria deletada' })
  @ApiResponse({ status: 400, description: 'Não é possível deletar categoria com produtos associados' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.deleteCategoryUseCase.execute(id);
  }
}

