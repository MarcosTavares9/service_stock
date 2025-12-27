import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/auth/ports/user.repository.port';
import { PaginationUtil, PaginationResult } from '@shared/utils/pagination.util';
import { User } from '@domain/auth/entities/user.entity';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginationResult<Omit<User, 'senha' | 'confirmationToken'>>> {
    const { page, limit } = PaginationUtil.normalize({
      page: params.page,
      limit: params.limit,
    });

    const { users, total } = await this.userRepository.findAll({
      page,
      limit,
      search: params.search,
    });

    const usersWithoutPassword = users.map(({ senha, confirmationToken, ...user }) => user);

    return PaginationUtil.create(usersWithoutPassword, total, page, limit);
  }
}

