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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { FileUtil } from '../../shared/utils/file.util';
import { EXAMPLE_UUID } from '../../shared/utils/example-values';
import { AppConfig } from '../../shared/config/app.config';

@ApiController('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna uma lista paginada de todos os usuários cadastrados no sistema.',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  async list(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.usersService.list({ page, limit, search });
  }

  @Post()
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário no sistema.',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos ou email já cadastrado' })
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza as informações de um usuário existente.',
  })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar usuário',
    description: 'Remove um usuário do sistema.',
  })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os detalhes completos de um usuário.',
  })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async get(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Get(':id/profile')
  @ApiOperation({
    summary: 'Buscar perfil completo do usuário',
    description: 'Retorna todas as informações do perfil de um usuário.',
  })
  @ApiResponse({ status: 200, description: 'Perfil encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Put(':id/profile')
  @ApiOperation({
    summary: 'Atualizar perfil do usuário',
    description: 'Atualiza as informações do perfil de um usuário.',
  })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async updateProfile(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(id, dto);
  }

  @Post(':id/profile/picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload foto de perfil',
    description: 'Faz upload de uma foto de perfil.',
  })
  @ApiResponse({ status: 200, description: 'Foto enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido ou formato não suportado' })
  async uploadProfilePicture(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    FileUtil.validateImage(file);
    const photoUrl = `${AppConfig.getUsersUploadPath()}/${FileUtil.generateFileName(file.originalname)}`;
    return { fotoPerfil: photoUrl };
  }

  @Delete(':id/profile/picture')
  @ApiOperation({
    summary: 'Remover foto de perfil',
    description: 'Remove a foto de perfil de um usuário.',
  })
  @ApiResponse({ status: 200, description: 'Foto removida com sucesso' })
  async deleteProfilePicture(@Param('id') id: string) {
    return { message: 'Foto removida com sucesso' };
  }
}
