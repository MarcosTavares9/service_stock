import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EntityStatus } from '../../../shared/utils/entity-status.enum';

export class UpdateLocationDto {
  @ApiProperty({ example: 'Estoque A', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Estoque principal', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: EntityStatus.ACTIVE, 
    required: false,
    enum: EntityStatus,
    description: 'Status da localização: true (ativo), false (inativo), blocked (excluído)'
  })
  @IsOptional()
  @IsEnum(EntityStatus)
  status?: string;
}
