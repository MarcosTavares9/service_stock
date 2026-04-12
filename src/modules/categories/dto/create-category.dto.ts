import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Informática', description: 'Nome da categoria' })
  @IsString({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    example: 'laptop',
    description: 'Nome do ícone da categoria',
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
  icon_name: string;
}
