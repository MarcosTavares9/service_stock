import { IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateProductDto } from './update-product.dto';
import { ApiProperty } from '@nestjs/swagger';

class BulkUpdateItemDto extends UpdateProductDto {
  @ApiProperty({ description: 'UUID do produto' })
  @IsString()
  id: string;
}

export class BulkUpdateProductDto {
  @ApiProperty({ type: [BulkUpdateItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateItemDto)
  products: BulkUpdateItemDto[];
}
