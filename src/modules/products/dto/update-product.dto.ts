import { IsString, IsNumber, IsOptional, Min, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EXAMPLE_UUID, EXAMPLE_UUID_2 } from '../../../shared/utils/example-values';

export class UpdateProductDto {
  @ApiProperty({ example: 'Notebook Dell', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: EXAMPLE_UUID, required: false, description: 'UUID da categoria' })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiProperty({ example: EXAMPLE_UUID_2, required: false, description: 'UUID da localização' })
  @IsOptional()
  @IsString()
  location_id?: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(0, { message: 'Quantidade não pode ser negativa' })
  quantity?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Estoque mínimo deve ser um número' })
  @Min(0, { message: 'Estoque mínimo não pode ser negativo' })
  minimum_stock?: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsUrl({}, { message: 'URL de imagem inválida' })
  image?: string;
}
