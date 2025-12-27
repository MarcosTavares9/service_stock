import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IconName } from '@domain/categories/entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Informática' })
  @IsString({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({
    example: 'laptop',
    enum: [
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
  })
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
    { message: 'IconName inválido' },
  )
  iconName: IconName;
}

