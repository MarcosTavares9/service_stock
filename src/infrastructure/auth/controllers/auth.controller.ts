import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUseCase } from '@application/auth/use-cases/login.use-case';
import { RegisterUseCase } from '@application/auth/use-cases/register.use-case';
import { ConfirmRegistrationUseCase } from '@application/auth/use-cases/confirm-registration.use-case';
import { LoginDto } from '@application/auth/dto/login.dto';
import { RegisterDto } from '@application/auth/dto/register.dto';
import { AuthResponseDto } from '@application/auth/dto/auth-response.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly confirmRegistrationUseCase: ConfirmRegistrationUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Email ou senha inválidos' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registro de novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar conta' })
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Post('confirm-registration/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar registro via token' })
  @ApiResponse({ status: 200, description: 'Conta confirmada com sucesso' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  async confirmRegistration(@Param('token') token: string) {
    return this.confirmRegistrationUseCase.execute(token);
  }
}

