import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EXAMPLE_UUID, EXAMPLE_UUID_2 } from '../../../shared/utils/example-values';

export class BulkDeleteProductDto {
  @ApiProperty({
    type: [String],
    example: [EXAMPLE_UUID, EXAMPLE_UUID_2],
    description: 'Array de UUIDs dos produtos a serem deletados',
  })
  @IsArray()
  @IsUUID(4, { each: true, message: 'Cada ID deve ser um UUID válido' })
  ids: string[];
}
