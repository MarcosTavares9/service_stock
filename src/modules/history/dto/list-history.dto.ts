import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListHistoryDto {
  @ApiProperty({ required: false, description: 'Número da página' })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: 'Itens por página' })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    required: false,
    example: 'entry',
    description: 'Tipo: entry, exit ou adjustment',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false, description: 'UUID do produto' })
  @IsOptional()
  @IsString()
  product_id?: string;

  @ApiProperty({ required: false, description: 'UUID do usuário' })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiProperty({ required: false, description: 'Data início (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dataInicio?: string;

  @ApiProperty({ required: false, description: 'Data fim (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dataFim?: string;
}
