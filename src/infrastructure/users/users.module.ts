import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { ListUsersUseCase } from '@application/users/use-cases/list-users.use-case';
import { CreateUserUseCase } from '@application/users/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@application/users/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@application/users/use-cases/delete-user.use-case';
import { GetUserProfileUseCase } from '@application/users/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '@application/users/use-cases/update-user-profile.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    ListUsersUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
  ],
})
export class UsersModule {}

