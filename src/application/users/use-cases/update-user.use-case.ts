import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/auth/ports/user.repository.port';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundException, ConflictException } from '@shared/exceptions/business.exception';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário');
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }
      user.email = dto.email;
    }

    if (dto.nome !== undefined) user.nome = dto.nome;
    if (dto.cargo !== undefined) user.cargo = dto.cargo;
    if (dto.status !== undefined) user.status = dto.status;
    if (dto.senha !== undefined) user.senha = dto.senha;

    const updatedUser = await this.userRepository.update(user);

    const { senha, confirmationToken, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }
}

