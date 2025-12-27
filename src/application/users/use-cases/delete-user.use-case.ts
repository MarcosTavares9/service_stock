import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/auth/ports/user.repository.port';
import { NotFoundException } from '@shared/exceptions/business.exception';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário');
    }

    await this.userRepository.delete(id);

    return { message: 'Usuário deletado com sucesso' };
  }
}

