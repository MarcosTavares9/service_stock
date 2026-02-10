import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category_id: string;

  @ApiProperty()
  location_id: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  minimum_stock: number;

  @ApiProperty()
  status: string;

  @ApiProperty({ nullable: true })
  image?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
