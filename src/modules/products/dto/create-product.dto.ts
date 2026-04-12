import { IsString, IsNumber, IsOptional, Min, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EXAMPLE_UUID, EXAMPLE_UUID_2 } from '../../../shared/utils/example-values';

export class CreateProductDto {
  @ApiProperty({ example: 'Notebook Dell', description: 'Nome do produto' })
  @IsString({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({ example: EXAMPLE_UUID, description: 'UUID da categoria' })
  @IsString({ message: 'Categoria é obrigatória' })
  category_id: string;

  @ApiProperty({ example: EXAMPLE_UUID_2, description: 'UUID da localização' })
  @IsString({ message: 'Localização é obrigatória' })
  location_id: string;

  @ApiProperty({ example: 10, description: 'Quantidade em estoque' })
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(0, { message: 'Quantidade não pode ser negativa' })
  quantity: number;

  @ApiProperty({ example: 5, description: 'Estoque mínimo para alerta' })
  @IsNumber({}, { message: 'Estoque mínimo deve ser um número' })
  @Min(0, { message: 'Estoque mínimo não pode ser negativo' })
  minimum_stock: number;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    required: false,
    description: 'URL da imagem do produto',
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL de imagem inválida' })
  image?: string;
}
