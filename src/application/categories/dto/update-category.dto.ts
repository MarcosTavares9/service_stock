import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IconName } from '@domain/categories/entities/category.entity';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Informática', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ example: 'laptop', required: false })
  @IsOptional()
  @IsEnum(
    [
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
    ],
  )
  iconName?: IconName;
}

