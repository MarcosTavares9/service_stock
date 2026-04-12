import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../auth/user.entity';
import {
  EXAMPLE_NAME,
  EXAMPLE_LAST_NAME,
  EXAMPLE_EMAIL,
  EXAMPLE_PASSWORD,
} from '../../../shared/utils/example-values';

export class CreateUserDto {
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

  @ApiProperty({ example: EXAMPLE_PASSWORD, description: 'Senha (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @ApiProperty({
    example: UserRole.OPERADOR,
    required: false,
    enum: UserRole,
    description: 'Role do usuário. Padrão: Operador',
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role inválida' })
  role?: UserRole;
}
