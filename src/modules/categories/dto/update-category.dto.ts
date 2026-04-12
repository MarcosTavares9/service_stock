import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Informática', required: false, description: 'Nome da categoria' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'laptop', required: false, description: 'Nome do ícone da categoria' })
  @IsOptional()
  @IsEnum([
    'laptop',
    'mouse',
    'headphones',
    'hdd',
    'memory',
    'chair',
    'print',
    'spray',
    'utensils',
    'tshirt',
    'box',
  ])
  icon_name?: string;
}
