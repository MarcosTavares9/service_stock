import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/auth/ports/user.repository.port';
import { NotFoundException } from '@shared/exceptions/business.exception';

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Perfil');
    }

    return {
      id: user.id,
      nome: user.nome,
      sobrenome: user.sobrenome,
      email: user.email,
      telefone: user.telefone,
      cnpj: user.cnpj,
      cargo: user.cargo,
      fotoPerfil: user.fotoPerfil,
    };
  }
}

