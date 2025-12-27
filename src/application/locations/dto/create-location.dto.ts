import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ example: 'Estoque A' })
  @IsString({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({ example: 'Estoque principal', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;
}

