import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/auth/ports/user.repository.port';
import { ITokenService } from '@domain/auth/ports/token.service.port';
import { IEmailService } from '@domain/auth/ports/email.service.port';
import { RegisterDto } from '../dto/register.dto';
import { User, UserStatus } from '@domain/auth/entities/user.entity';
import { ConflictException } from '@shared/exceptions/business.exception';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const confirmationToken = this.tokenService.generateConfirmationToken();

    const user = new User();
    user.nome = dto.name;
    user.sobrenome = dto.lastName;
    user.email = dto.email;
    user.telefone = dto.phone;
    user.senha = dto.password;
    user.status = UserStatus.INATIVO;
    user.confirmationToken = confirmationToken;
    user.emailConfirmed = false;

    await this.userRepository.create(user);

    await this.emailService.sendConfirmationEmail(
      user.email,
      confirmationToken,
      user.nome,
    );

    return {
      message: 'Usuário criado com sucesso. Verifique seu email para confirmar a conta.',
    };
  }
}

