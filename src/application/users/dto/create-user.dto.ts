import { IsString, IsEmail, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@domain/auth/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'João' })
  @IsString({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({ example: 'joao@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'Administrador', enum: ['Administrador', 'Gerente', 'Operador'] })
  @IsEnum(UserRole, { message: 'Cargo inválido' })
  cargo: UserRole;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha: string;
}

