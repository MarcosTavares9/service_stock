import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '@shared/decorators/api-controller.decorator';
import { CurrentUser } from '@infrastructure/auth/decorators/current-user.decorator';
import { CreateUserDto } from '@application/users/dto/create-user.dto';
import { UpdateUserDto } from '@application/users/dto/update-user.dto';
import { UpdateProfileDto } from '@application/users/dto/update-profile.dto';
import { ListUsersUseCase } from '@application/users/use-cases/list-users.use-case';
import { CreateUserUseCase } from '@application/users/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@application/users/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@application/users/use-cases/delete-user.use-case';
import { GetUserProfileUseCase } from '@application/users/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '@application/users/use-cases/update-user-profile.use-case';
import { FileUtil } from '@shared/utils/file.util';

@ApiController('Usuários')
@Controller('users')
export class UsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  async list(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.listUsersUseCase.execute({ page, limit, search });
  }

  @Post()
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado' })
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async delete(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Buscar perfil do usuário' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async getProfile(@Param('id') id: string) {
    return this.getUserProfileUseCase.execute(id);
  }

  @Put(':id/profile')
  @ApiOperation({ summary: 'Atualizar perfil do usuário' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async updateProfile(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.updateUserProfileUseCase.execute(id, dto);
  }

  @Post(':id/profile/picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload foto de perfil' })
  @ApiResponse({ status: 200, description: 'Foto enviada' })
  async uploadProfilePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    FileUtil.validateImage(file);
    // TODO: Implementar upload real
    const photoUrl = `/uploads/users/${FileUtil.generateFileName(file.originalname)}`;
    return { fotoPerfil: photoUrl };
  }

  @Delete(':id/profile/picture')
  @ApiOperation({ summary: 'Remover foto de perfil' })
  @ApiResponse({ status: 200, description: 'Foto removida' })
  async deleteProfilePicture(@Param('id') id: string) {
    // TODO: Implementar remoção real
    return { message: 'Foto removida com sucesso' };
  }
}

