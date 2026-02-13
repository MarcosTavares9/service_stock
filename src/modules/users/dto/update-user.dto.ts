import { IsString, IsEmail, IsOptional, MinLength, IsEnum, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EntityStatus } from '../../../shared/utils/entity-status.enum';
import {
  EXAMPLE_NAME,
  EXAMPLE_LAST_NAME,
  EXAMPLE_EMAIL,
  EXAMPLE_PASSWORD,
} from '../../../shared/utils/example-values';

export class UpdateUserDto {
  @ApiProperty({ example: EXAMPLE_NAME, required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: EXAMPLE_LAST_NAME, required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: EXAMPLE_EMAIL, required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiProperty({
    example: EntityStatus.ACTIVE,
    required: false,
    enum: EntityStatus,
    description: 'Status do usuário',
  })
  @IsOptional()
  @IsEnum(EntityStatus)
  status?: string;

  @ApiProperty({ example: EXAMPLE_PASSWORD, required: false })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password?: string;

  @ApiProperty({
    example: 'https://firebasestorage.googleapis.com/...',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  @IsString()
  profilePicture?: string | null;
}
