import { IsString, IsEmail, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'João', required: false, description: 'Nome do usuário' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ example: 'Silva', required: false, description: 'Sobrenome do usuário' })
  @IsOptional()
  @IsString()
  sobrenome?: string;

  @ApiProperty({ example: 'joao@example.com', required: false, description: 'Email do usuário' })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiProperty({ example: '11999999999', required: false, description: 'Telefone do usuário' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ example: '12345678000190', required: false, description: 'CNPJ da empresa' })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ example: 'Administrador', required: false, description: 'Cargo do usuário' })
  @IsOptional()
  @IsString()
  cargo?: string;

  @ApiProperty({
    example: 'https://firebasestorage.googleapis.com/...',
    required: false,
    nullable: true,
    description: 'URL da foto de perfil (null para remover)',
  })
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  @IsString()
  profilePicture?: string | null;
}
