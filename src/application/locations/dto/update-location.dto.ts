import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDto {
  @ApiProperty({ example: 'Estoque A', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ example: 'Estoque principal', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

