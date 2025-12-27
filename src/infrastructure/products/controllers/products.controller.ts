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
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '@shared/decorators/api-controller.decorator';
import { CurrentUser } from '@infrastructure/auth/decorators/current-user.decorator';
import { CreateProductDto } from '@application/products/dto/create-product.dto';
import { UpdateProductDto } from '@application/products/dto/update-product.dto';
import { BulkCreateProductDto } from '@application/products/dto/bulk-create-product.dto';
import { CreateProductUseCase } from '@application/products/use-cases/create-product.use-case';
import { GetProductUseCase } from '@application/products/use-cases/get-product.use-case';
import { ListProductsUseCase } from '@application/products/use-cases/list-products.use-case';
import { UpdateProductUseCase } from '@application/products/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '@application/products/use-cases/delete-product.use-case';
import { BulkCreateProductsUseCase } from '@application/products/use-cases/bulk-create-products.use-case';
import { FileUtil } from '@shared/utils/file.util';

@ApiController('Produtos')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly bulkCreateProductsUseCase: BulkCreateProductsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  async list(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('categoria') categoria?: string,
    @Query('status') status?: string,
  ) {
    return this.listProductsUseCase.execute({
      page,
      limit,
      search,
      categoria,
      status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.getProductUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar produto' })
  @ApiResponse({ status: 201, description: 'Produto criado' })
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.createProductUseCase.execute(dto, user.id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Criar múltiplos produtos' })
  @ApiResponse({ status: 201, description: 'Produtos criados' })
  async bulkCreate(
    @Body() dto: BulkCreateProductDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.bulkCreateProductsUseCase.execute(dto, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.updateProductUseCase.execute(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar produto' })
  @ApiResponse({ status: 200, description: 'Produto deletado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: string },
  ) {
    return this.deleteProductUseCase.execute(id, user.id);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload imagem do produto' })
  @ApiResponse({ status: 200, description: 'Imagem enviada' })
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    FileUtil.validateImage(file);
    // TODO: Implementar upload real (S3, local storage, etc)
    const imageUrl = `/uploads/products/${FileUtil.generateFileName(file.originalname)}`;
    return { imagem: imageUrl };
  }
}

