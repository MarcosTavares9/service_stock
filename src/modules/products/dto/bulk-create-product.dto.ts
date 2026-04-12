import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BulkCreateProductDto {
  @ApiProperty({ type: [CreateProductDto], description: 'Lista de produtos para criar' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  products: CreateProductDto[];
}
