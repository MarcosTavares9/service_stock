import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { ITokenService } from './token.service';
import { UnauthorizedException } from '../../shared/core/business.exception';
import { EXAMPLE_UUID, EXAMPLE_EMAIL, EXAMPLE_NAME, EXAMPLE_LAST_NAME } from '../../shared/utils/example-values';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Autenticar usuário',
    description: 'Realiza o login do usuário no sistema. Retorna um token JWT válido para autenticação em requisições subsequentes.'
  })
  @ApiResponse({ 
    status: 200, 
    type: AuthResponseDto,
    description: 'Login realizado com sucesso',
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: EXAMPLE_UUID,
        firstName: EXAMPLE_NAME,
        lastName: EXAMPLE_LAST_NAME,
        email: EXAMPLE_EMAIL,
        photo: null
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Email ou senha inválidos' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Registrar novo usuário',
    description: 'Cria uma nova conta de usuário no sistema. Um email de confirmação será enviado para ativação da conta.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso. Verifique seu email para confirmar a conta.',
    example: {
      message: 'Usuário criado com sucesso. Verifique seu email para confirmar a conta.',
      userId: EXAMPLE_UUID
    }
  })
  @ApiResponse({ status: 400, description: 'Erro ao criar conta. Email já cadastrado ou dados inválidos.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('confirm-registration/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Confirmar registro de conta',
    description: 'Ativa a conta do usuário através do token de confirmação enviado por email. O token é válido por 24 horas.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Conta confirmada e ativada com sucesso',
    example: {
      message: 'Conta confirmada com sucesso',
      userId: EXAMPLE_UUID
    }
  })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  async confirmRegistration(@Param('token') token: string) {
    return this.authService.confirmRegistration(token);
  }

  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Verificar validade do token JWT',
    description: 'Valida se um token JWT é válido e não expirado. Retorna informações do payload do token.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token válido',
    example: {
      valid: true,
      payload: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'joao@example.com',
        iat: 1705000000,
        exp: 1705086400
      },
      message: 'Token válido e não expirado'
    }
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  async verifyToken(@Body() dto: VerifyTokenDto) {
    try {
      const payload = this.tokenService.verifyToken(dto.token);
      return { 
        valid: true, 
        payload,
        message: 'Token válido e não expirado'
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido: ' + (error as Error).message);
    }
  }
}
