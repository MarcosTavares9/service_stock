import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HistoryType } from '@domain/history/entities/history.entity';

export class ListHistoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ enum: HistoryType, required: false })
  @IsOptional()
  @IsEnum(HistoryType)
  tipo?: HistoryType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  produto?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  usuario?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dataInicio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dataFim?: string;
}

