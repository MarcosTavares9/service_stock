import { IsString, IsNumber, IsOptional, Min, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Notebook Dell' })
  @IsString({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({ example: 'Informática' })
  @IsString({ message: 'Categoria é obrigatória' })
  categoria: string;

  @ApiProperty({ example: 10 })
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(0, { message: 'Quantidade não pode ser negativa' })
  quantidade: number;

  @ApiProperty({ example: 5 })
  @IsNumber({}, { message: 'Estoque mínimo deve ser um número' })
  @Min(0, { message: 'Estoque mínimo não pode ser negativo' })
  estoqueMinimo: number;

  @ApiProperty({ example: 'Estoque A' })
  @IsString({ message: 'Localização é obrigatória' })
  localizacao: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsUrl({}, { message: 'URL de imagem inválida' })
  imagem?: string;
}

