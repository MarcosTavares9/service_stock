import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiController } from '../../shared/core/api-controller.decorator';
import { Roles } from '../../shared/core/roles.decorator';
import { ALL_ROLES } from '../auth/user.entity';
import { FileUtil } from '../../shared/utils/file.util';
import { cloudinary, configureCloudinary } from '../../shared/config/cloudinary.config';

configureCloudinary();

@ApiController('Uploads')
@Controller('uploads')
export class UploadsController {
  @Post('image')
  @Roles(...ALL_ROLES)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload de imagem para o Cloudinary' })
  @ApiResponse({ status: 201, description: 'URL da imagem retornada com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido ou formato não suportado' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder = 'products',
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    FileUtil.validateImage(file);

    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Falha no upload'));
          resolve(result.secure_url);
        },
      );
      stream.end(file.buffer);
    });

    return { url };
  }
}
