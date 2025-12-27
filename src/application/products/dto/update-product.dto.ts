import { IsString, IsNumber, IsOptional, Min, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ example: 'Notebook Dell', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ example: 'Informática', required: false })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(0, { message: 'Quantidade não pode ser negativa' })
  quantidade?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Estoque mínimo deve ser um número' })
  @Min(0, { message: 'Estoque mínimo não pode ser negativo' })
  estoqueMinimo?: number;

  @ApiProperty({ example: 'Estoque A', required: false })
  @IsOptional()
  @IsString()
  localizacao?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsUrl({}, { message: 'URL de imagem inválida' })
  imagem?: string;
}

