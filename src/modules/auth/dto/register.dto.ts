import { IsEmail, IsString, MinLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  EXAMPLE_NAME,
  EXAMPLE_LAST_NAME,
  EXAMPLE_EMAIL,
  EXAMPLE_PHONE,
  EXAMPLE_PASSWORD,
} from '../../../shared/utils/example-values';

export class RegisterDto {
  @ApiProperty({ example: EXAMPLE_NAME, description: 'Nome do usuário' })
  @IsString({ message: 'Nome é obrigatório' })
  firstName: string;

  @ApiProperty({ example: EXAMPLE_LAST_NAME, required: false, description: 'Sobrenome do usuário' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: EXAMPLE_EMAIL, description: 'Email do usuário' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: EXAMPLE_PHONE, description: 'Telefone (apenas números)' })
  @IsString()
  @Matches(/^\d+$/, { message: 'Telefone deve conter apenas números' })
  phone: string;

  @ApiProperty({ example: EXAMPLE_PASSWORD, description: 'Senha (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}
