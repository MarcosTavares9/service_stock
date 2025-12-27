import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiPropertyOptional({ example: 'busca' })
  @IsOptional()
  @IsString()
  search?: string;
}

