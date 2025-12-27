import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/auth/ports/user.repository.port';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { NotFoundException, ConflictException } from '@shared/exceptions/business.exception';

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Perfil');
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }
      user.email = dto.email;
    }

    user.nome = dto.nome;
    if (dto.sobrenome !== undefined) user.sobrenome = dto.sobrenome;
    if (dto.telefone !== undefined) user.telefone = dto.telefone;
    if (dto.cnpj !== undefined) user.cnpj = dto.cnpj;
    if (dto.cargo !== undefined) user.cargo = dto.cargo as any;

    const updatedUser = await this.userRepository.update(user);

    return {
      id: updatedUser.id,
      nome: updatedUser.nome,
      sobrenome: updatedUser.sobrenome,
      email: updatedUser.email,
      telefone: updatedUser.telefone,
      cnpj: updatedUser.cnpj,
      cargo: updatedUser.cargo,
      fotoPerfil: updatedUser.fotoPerfil,
    };
  }
}

