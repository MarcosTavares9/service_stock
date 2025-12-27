import { IsString, IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@domain/auth/entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ example: 'João', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ example: 'joao@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiProperty({ example: 'Administrador', required: false })
  @IsOptional()
  @IsEnum(UserRole)
  cargo?: UserRole;

  @ApiProperty({ example: 'ativo', required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({ example: 'password123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha?: string;
}

