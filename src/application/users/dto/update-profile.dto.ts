import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'João' })
  @IsString({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({ example: 'Silva', required: false })
  @IsOptional()
  @IsString()
  sobrenome?: string;

  @ApiProperty({ example: 'joao@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: '11999999999', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ example: '12345678000190', required: false })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ example: 'Administrador', required: false })
  @IsOptional()
  @IsString()
  cargo?: string;
}

