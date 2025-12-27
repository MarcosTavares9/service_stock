import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/auth/ports/user.repository.port';
import { User, UserStatus } from '@domain/auth/entities/user.entity';
import { BusinessException } from '@shared/exceptions/business.exception';

@Injectable()
export class ConfirmRegistrationUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByConfirmationToken(token);

    if (!user) {
      throw new BusinessException('Token inválido ou expirado');
    }

    if (user.emailConfirmed) {
      throw new BusinessException('Email já confirmado');
    }

    user.emailConfirmed = true;
    user.status = UserStatus.ATIVO;
    user.confirmationToken = null;

    await this.userRepository.update(user);

    return {
      message: 'Conta confirmada com sucesso',
    };
  }
}

