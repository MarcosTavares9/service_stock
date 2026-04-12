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
import { Roles } from '../../shared/core/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole, MANAGER_ROLES, ALL_ROLES } from '../auth/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BulkCreateProductDto } from './dto/bulk-create-product.dto';
import { BulkUpdateProductDto } from './dto/bulk-update-product.dto';
import { BulkDeleteProductDto } from './dto/bulk-delete-product.dto';
import { ProductsService } from './products.service';
import { FileUtil } from '../../shared/utils/file.util';
import { EXAMPLE_UUID, EXAMPLE_UUID_2, EXAMPLE_UUID_3 } from '../../shared/utils/example-values';
import { AppConfig } from '../../shared/config/app.config';

type AuthUser = { id: string; email: string; role: UserRole };

@ApiController('Produtos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ─── Todos os roles podem listar e consultar produtos ────────────────────
  @Get()
  @Roles(...ALL_ROLES)
  @ApiOperation({
    summary: 'Listar todos os produtos',
    description: 'Retorna lista de produtos. Acesso: todos os roles.',
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
          updated_at: '2026-01-11T02:30:00.000Z',
        },
      ],
    },
  })
  async list(@CurrentUser() user: AuthUser) {
    return this.productsService.list(user.id);
  }

  @Get(':id')
  @Roles(...ALL_ROLES)
  @ApiOperation({
    summary: 'Buscar produto por UUID',
    description: 'Retorna detalhes de um produto. Acesso: todos os roles.',
  })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado com o UUID fornecido' })
  async get(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.productsService.getById(id, user.id);
  }

  // ─── Admin + Gerente + Operador podem criar/editar/deletar produtos ──────
  @Post()
  @Roles(...ALL_ROLES)
  @ApiOperation({
    summary: 'Criar novo produto',
    description: 'Cria um produto. Acesso: todos os roles.',
  })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos' })
  async create(@Body() dto: CreateProductDto, @CurrentUser() user: AuthUser) {
    return this.productsService.create(dto, user.id);
  }

  @Post('bulk')
  @Roles(...ALL_ROLES)
  @ApiOperation({
    summary: 'Criar múltiplos produtos',
    description: 'Cria vários produtos de uma vez. Acesso: todos os roles.',
  })
  @ApiResponse({ status: 201, description: 'Produtos criados com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar produtos.' })
  async bulkCreate(@Body() dto: BulkCreateProductDto, @CurrentUser() user: AuthUser) {
    return this.productsService.bulkCreate(dto, user.id);
  }

  @Put(':id')
  @Roles(...ALL_ROLES)
  @ApiOperation({
    summary: 'Atualizar produto',
    description: 'Atualiza informações de um produto. Acesso: todos os roles.',
  })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto, @CurrentUser() user: AuthUser) {
    return this.productsService.update(id, dto, user.id);
  }

  @Put('bulk')
  @Roles(...ALL_ROLES)
  @ApiOperation({
    summary: 'Atualizar múltiplos produtos',
    description: 'Atualiza vários produtos de uma vez. Acesso: todos os roles.',
  })
  @ApiResponse({ status: 200, description: 'Produtos atualizados com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao atualizar produtos.' })
  async bulkUpdate(@Body() dto: BulkUpdateProductDto, @CurrentUser() user: AuthUser) {
    return this.productsService.bulkUpdate(dto, user.id);
  }

  // ─── Apenas Admin + Gerente podem deletar produtos ───────────────────────
  @Delete(':id')
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Deletar produto',
    description: 'Remove um produto do sistema. Acesso: Admin, Gerente.',
  })
  @ApiResponse({ status: 200, description: 'Produto deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async delete(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.productsService.delete(id, user.id);
  }

  @Delete('bulk')
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Deletar múltiplos produtos',
    description: 'Remove vários produtos de uma vez. Acesso: Admin, Gerente.',
  })
  @ApiResponse({ status: 200, description: 'Produtos deletados com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao deletar produtos.' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async bulkDelete(@Body() dto: BulkDeleteProductDto, @CurrentUser() user: AuthUser) {
    return this.productsService.bulkDelete(dto, user.id);
  }

  // ─── Upload de imagem: verifica ownership antes de vincular ──────────────
  @Post(':id/image')
  @Roles(...ALL_ROLES)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload imagem do produto',
    description: 'Faz upload de uma imagem para um produto específico. Verifica se o produto existe e o usuário tem acesso.',
  })
  @ApiResponse({ status: 200, description: 'Imagem enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido ou formato não suportado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    // Verifica que o produto existe e o usuário tem acesso (lança 404 se não)
    await this.productsService.getById(id, user.id);
    FileUtil.validateImage(file);
    const imageUrl = `${AppConfig.getProductsUploadPath()}/${FileUtil.generateFileName(file.originalname)}`;
    return { image: imageUrl };
  }
}
