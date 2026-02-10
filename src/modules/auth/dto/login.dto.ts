import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EXAMPLE_EMAIL, EXAMPLE_PASSWORD } from '../../../shared/utils/example-values';

export class LoginDto {
  @ApiProperty({ example: EXAMPLE_EMAIL })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: EXAMPLE_PASSWORD })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}
