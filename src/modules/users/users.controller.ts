import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '../../shared/core/api-controller.decorator';
import { Roles } from '../../shared/core/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole, ADMIN_ROLES, MANAGER_ROLES } from '../auth/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { FileUtil } from '../../shared/utils/file.util';
import { EXAMPLE_UUID } from '../../shared/utils/example-values';
import { AppConfig } from '../../shared/config/app.config';
import { ForbiddenException, BadRequestException } from '../../shared/core/business.exception';

type AuthUser = { id: string; email: string; role: UserRole };

@ApiController('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── Apenas Admin + Gerente podem listar todos os usuários ───────────────
  @Get()
  @Roles(...MANAGER_ROLES)
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna uma lista paginada de todos os usuários. Acesso: Admin, Gerente.',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async list(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.usersService.list({ page, limit, search });
  }

  // ─── Apenas Admin pode criar usuários ────────────────────────────────────
  @Post()
  @Roles(...ADMIN_ROLES)
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário no sistema. Acesso: Admin.',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos ou email já cadastrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // ─── Apenas Admin pode atualizar dados completos (status, role, etc.) ────
  @Put(':id')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({
    summary: 'Atualizar usuário (admin)',
    description: 'Atualiza informações completas de um usuário, incluindo status e role. Acesso: Admin.',
  })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  // ─── Apenas Admin pode deletar (soft delete) ─────────────────────────────
  @Delete(':id')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({
    summary: 'Deletar usuário',
    description: 'Desativa (soft delete) um usuário do sistema. Acesso: Admin.',
  })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 400, description: 'Não é possível deletar a própria conta' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async delete(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    if (id === currentUser.id) {
      throw new BadRequestException('Não é possível deletar a própria conta');
    }
    return this.usersService.delete(id);
  }

  // ─── Admin + Gerente podem ver qualquer usuário; Operador só o próprio ───
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description:
      'Retorna dados de um usuário. Admin/Gerente: qualquer usuário. Operador: apenas o próprio.',
  })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async get(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    this.assertManagerOrOwner(currentUser, id);
    return this.usersService.getProfile(id);
  }

  // ─── Admin + Gerente podem ver qualquer perfil; Operador só o próprio ────
  @Get(':id/profile')
  @ApiOperation({
    summary: 'Buscar perfil completo do usuário',
    description:
      'Retorna perfil completo. Admin/Gerente: qualquer perfil. Operador: apenas o próprio.',
  })
  @ApiResponse({ status: 200, description: 'Perfil encontrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async getProfile(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    this.assertManagerOrOwner(currentUser, id);
    return this.usersService.getProfile(id);
  }

  // ─── Admin pode editar qualquer perfil; demais roles apenas o próprio ────
  @Put(':id/profile')
  @ApiOperation({
    summary: 'Atualizar perfil do usuário',
    description: 'Atualiza perfil. Admin: qualquer perfil. Demais roles: apenas o próprio.',
  })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    this.assertAdminOrOwner(currentUser, id);
    return this.usersService.updateProfile(id, dto);
  }

  // ─── Upload de foto: Admin pode fazer para qualquer um; demais só o próprio
  @Post(':id/profile/picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload foto de perfil',
    description: 'Faz upload de uma foto de perfil.',
  })
  @ApiResponse({ status: 200, description: 'Foto enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido ou formato não suportado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async uploadProfilePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: AuthUser,
  ) {
    this.assertAdminOrOwner(currentUser, id);
    FileUtil.validateImage(file);
    const photoUrl = `${AppConfig.getUsersUploadPath()}/${FileUtil.generateFileName(file.originalname)}`;
    return { fotoPerfil: photoUrl };
  }

  // ─── Remover foto: Admin pode para qualquer um; demais só o próprio ──────
  @Delete(':id/profile/picture')
  @ApiOperation({
    summary: 'Remover foto de perfil',
    description: 'Remove a foto de perfil.',
  })
  @ApiResponse({ status: 200, description: 'Foto removida com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async deleteProfilePicture(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    this.assertAdminOrOwner(currentUser, id);
    return { message: 'Foto removida com sucesso' };
  }

  private assertManagerOrOwner(currentUser: AuthUser, targetId: string): void {
    if (!MANAGER_ROLES.includes(currentUser.role) && currentUser.id !== targetId) {
      throw new ForbiddenException('Acesso negado');
    }
  }

  private assertAdminOrOwner(currentUser: AuthUser, targetId: string): void {
    if (!ADMIN_ROLES.includes(currentUser.role) && currentUser.id !== targetId) {
      throw new ForbiddenException('Acesso negado');
    }
  }
}
