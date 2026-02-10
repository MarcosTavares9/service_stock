import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListHistoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false, example: 'entry' })
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dataInicio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dataFim?: string;
}
