import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ example: 'Estoque A', description: 'Nome da localização' })
  @IsString({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    example: 'Estoque principal',
    required: false,
    description: 'Descrição da localização',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
