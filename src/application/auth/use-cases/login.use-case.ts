import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/auth/ports/user.repository.port';
import { ITokenService } from '@domain/auth/ports/token.service.port';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UnauthorizedException } from '@shared/exceptions/business.exception';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    if (!user.emailConfirmed) {
      throw new UnauthorizedException('Email não confirmado. Verifique sua caixa de entrada.');
    }

    if (user.status !== 'ativo') {
      throw new UnauthorizedException('Usuário inativo');
    }

    const isValidPassword = await user.validatePassword(dto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const token = this.tokenService.generateToken({
      id: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.nome,
        email: user.email,
        photo: user.fotoPerfil,
      },
    };
  }
}

