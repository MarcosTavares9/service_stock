import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../auth/user.repository';
import { User } from '../auth/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PaginationUtil, PaginationResult } from '../../shared/utils/pagination.util';
import { NotFoundException, ConflictException } from '../../shared/core/business.exception';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async list(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginationResult<any>> {
    const { page, limit } = PaginationUtil.normalize({
      page: params.page,
      limit: params.limit,
    });

    const { users, total } = await this.userRepository.findAll({
      page,
      limit,
      search: params.search,
    });

    const usersWithoutPassword = users.map(
      ({ password, hashPassword, validatePassword, ...user }) => ({
        ...user,
        password: undefined,
      }),
    );

    return PaginationUtil.create(usersWithoutPassword, total, page, limit);
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = new User();
    user.name = dto.firstName;
    user.last_name = dto.lastName;
    user.email = dto.email;
    user.password = dto.password;
    user.status = EntityStatus.ACTIVE;
    user.email_confirmed = true;

    const createdUser = await this.userRepository.create(user);

    const { password, ...userWithoutPassword } = createdUser;

    return {
      id: userWithoutPassword.id,
      firstName: userWithoutPassword.name,
      lastName: userWithoutPassword.last_name,
      email: userWithoutPassword.email,
      status: userWithoutPassword.status,
      emailConfirmed: userWithoutPassword.email_confirmed,
      createdAt: userWithoutPassword.created_at,
      updatedAt: userWithoutPassword.updated_at,
    };
  }

  async update(id: string, dto: UpdateUserDto) {
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

    if (dto.firstName !== undefined) user.name = dto.firstName;
    if (dto.lastName !== undefined) user.last_name = dto.lastName;
    if (dto.status !== undefined) user.status = dto.status;
    if (dto.password !== undefined) user.password = dto.password;
    if (dto.profilePicture !== undefined) user.profile_picture = dto.profilePicture;

    const updatedUser = await this.userRepository.update(user);

    const { password, ...userWithoutPassword } = updatedUser;

    return {
      id: userWithoutPassword.id,
      firstName: userWithoutPassword.name,
      lastName: userWithoutPassword.last_name,
      email: userWithoutPassword.email,
      phone: userWithoutPassword.phone,
      profilePicture: userWithoutPassword.profile_picture,
      status: userWithoutPassword.status,
      emailConfirmed: userWithoutPassword.email_confirmed,
      createdAt: userWithoutPassword.created_at,
      updatedAt: userWithoutPassword.updated_at,
    };
  }

  async delete(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário');
    }

    await this.userRepository.delete(id);

    return { message: 'Usuário deletado com sucesso' };
  }

  async getProfile(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário');
    }

    return {
      id: user.id,
      firstName: user.name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profile_picture,
      status: user.status,
      emailConfirmed: user.email_confirmed,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
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

    user.name = dto.nome;
    if (dto.sobrenome !== undefined) user.last_name = dto.sobrenome;
    if (dto.telefone !== undefined) user.phone = dto.telefone;
    if (dto.profilePicture !== undefined) user.profile_picture = dto.profilePicture;

    const updatedUser = await this.userRepository.update(user);

    return {
      id: updatedUser.id,
      firstName: updatedUser.name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      profilePicture: updatedUser.profile_picture,
      status: updatedUser.status,
      emailConfirmed: updatedUser.email_confirmed,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    };
  }
}
