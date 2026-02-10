import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from './user.repository';
import { ITokenService } from './token.service';
import { IEmailService } from './email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from './user.entity';
import { UnauthorizedException, ConflictException, BusinessException } from '../../shared/core/business.exception';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
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
        firstName: user.name,
        lastName: user.last_name,
        email: user.email,
        photo: user.profile_picture,
      },
    };
  }

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const confirmationToken = this.tokenService.generateConfirmationToken();

    const user = new User();
    user.name = dto.firstName;
    user.last_name = dto.lastName;
    user.email = dto.email;
    user.phone = dto.phone;
    user.password = dto.password;
    user.status = EntityStatus.INACTIVE;
    user.email_confirmed = false;

    await this.userRepository.create(user);

    await this.emailService.sendConfirmationEmail(
      user.email,
      confirmationToken,
      user.name,
    );

    return {
      message: 'Usuário criado com sucesso. Verifique seu email para confirmar a conta.',
    };
  }

  async confirmRegistration(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByConfirmationToken(token);

    if (!user) {
      throw new BusinessException('Token inválido ou expirado');
    }

    if (user.email_confirmed) {
      throw new BusinessException('Email já confirmado');
    }

    user.email_confirmed = true;
    user.status = EntityStatus.ACTIVE;

    await this.userRepository.update(user);

    return {
      message: 'Conta confirmada com sucesso',
    };
  }
}
