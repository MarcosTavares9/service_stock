import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  EXAMPLE_NAME,
  EXAMPLE_LAST_NAME,
  EXAMPLE_EMAIL,
  EXAMPLE_PASSWORD,
} from '../../../shared/utils/example-values';

export class CreateUserDto {
  @ApiProperty({ example: EXAMPLE_NAME })
  @IsString({ message: 'Nome é obrigatório' })
  firstName: string;

  @ApiProperty({ example: EXAMPLE_LAST_NAME, required: false })
  @IsString()
  lastName?: string;

  @ApiProperty({ example: EXAMPLE_EMAIL })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: EXAMPLE_PASSWORD })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}
