import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/auth/ports/user.repository.port';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserStatus } from '@domain/auth/entities/user.entity';
import { ConflictException } from '@shared/exceptions/business.exception';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = new User();
    user.nome = dto.nome;
    user.email = dto.email;
    user.cargo = dto.cargo;
    user.senha = dto.senha;
    user.status = UserStatus.ATIVO;
    user.emailConfirmed = true;

    const createdUser = await this.userRepository.create(user);

    const { senha, confirmationToken, ...userWithoutPassword } = createdUser;

    return userWithoutPassword;
  }
}

