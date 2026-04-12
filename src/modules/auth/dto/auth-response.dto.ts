import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'Token JWT de autenticação' })
  token: string;

  @ApiProperty({ description: 'Dados do usuário autenticado' })
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    photo?: string;
    role: string;
  };
}
