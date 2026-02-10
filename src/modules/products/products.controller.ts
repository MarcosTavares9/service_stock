import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '../../shared/core/api-controller.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BulkCreateProductDto } from './dto/bulk-create-product.dto';
import { BulkUpdateProductDto } from './dto/bulk-update-product.dto';
import { BulkDeleteProductDto } from './dto/bulk-delete-product.dto';
import { ProductsService } from './products.service';
import { FileUtil } from '../../shared/utils/file.util';
import { EXAMPLE_UUID, EXAMPLE_UUID_2, EXAMPLE_UUID_3 } from '../../shared/utils/example-values';
import { AppConfig } from '../../shared/config/app.config';

@ApiController('Produtos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Listar todos os produtos',
    description: 'Retorna uma lista completa de todos os produtos cadastrados no sistema, incluindo informações de estoque, categoria e localização.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de produtos retornada com sucesso',
    example: {
      data: [
        {
          uuid: EXAMPLE_UUID,
          name: 'Notebook Dell',
          category_id: EXAMPLE_UUID_2,
          location_id: EXAMPLE_UUID_3,
          quantity: 10,
          minimum_stock: 5,
          stock_status: 'ok',
          status: 'true',
          image: 'https://example.com/image.jpg',
          created_at: '2026-01-11T02:30:00.000Z',
          updated_at: '2026-01-11T02:30:00.000Z'
        }
      ]
    }
  })
  async list() {
    return this.productsService.list();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar produto por UUID',
    description: 'Retorna os detalhes completos de um produto específico identificado pelo seu UUID.'
  })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado com o UUID fornecido' })
  async get(@Param('id') id: string) {
    return this.productsService.getById(id);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Criar novo produto',
    description: 'Cria um novo produto no sistema com as informações fornecidas.'
  })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos' })
  async create(@Body() dto: CreateProductDto, @CurrentUser() user: { id: string; email: string }) {
    return this.productsService.create(dto, user.id);
  }

  @Post('bulk')
  @ApiOperation({ 
    summary: 'Criar múltiplos produtos',
    description: 'Cria vários produtos de uma vez através de uma lista.'
  })
  @ApiResponse({ status: 201, description: 'Produtos criados com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar produtos.' })
  async bulkCreate(
    @Body() dto: BulkCreateProductDto,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.productsService.bulkCreate(dto, user.id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Atualizar produto',
    description: 'Atualiza as informações de um produto existente.'
  })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.productsService.update(id, dto, user.id);
  }

  @Put('bulk')
  @ApiOperation({ 
    summary: 'Atualizar múltiplos produtos',
    description: 'Atualiza vários produtos de uma vez.'
  })
  @ApiResponse({ status: 200, description: 'Produtos atualizados com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao atualizar produtos.' })
  async bulkUpdate(
    @Body() dto: BulkUpdateProductDto,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.productsService.bulkUpdate(dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Deletar produto',
    description: 'Remove um produto do sistema.'
  })
  @ApiResponse({ status: 200, description: 'Produto deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.productsService.delete(id, user.id);
  }

  @Delete('bulk')
  @ApiOperation({ 
    summary: 'Deletar múltiplos produtos',
    description: 'Remove vários produtos do sistema de uma vez.'
  })
  @ApiResponse({ status: 200, description: 'Produtos deletados com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao deletar produtos.' })
  async bulkDelete(
    @Body() dto: BulkDeleteProductDto,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.productsService.bulkDelete(dto, user.id);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Upload imagem do produto',
    description: 'Faz upload de uma imagem para um produto específico.'
  })
  @ApiResponse({ status: 200, description: 'Imagem enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido ou formato não suportado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    FileUtil.validateImage(file);
    const imageUrl = `${AppConfig.getProductsUploadPath()}/${FileUtil.generateFileName(file.originalname)}`;
    return { image: imageUrl };
  }
}
