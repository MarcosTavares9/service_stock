import { extname } from 'path';
import { BadRequestException } from '../core/business.exception';

const ALLOWED_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_SIZE = 15 * 1024 * 1024; // 15MB

// JPEG magic bytes: FF D8 FF — PNG: 89 50 4E 47
const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/jpg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
};

export class FileUtil {
  static validateImage(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException('Formato inválido. Use PNG, JPEG ou WebP.');
    }

    const ext = extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new BadRequestException('Extensão de arquivo inválida.');
    }

    if (file.buffer) {
      const magic = MAGIC_BYTES[file.mimetype];
      if (magic && !magic.every((byte, i) => file.buffer[i] === byte)) {
        throw new BadRequestException('O conteúdo do arquivo não corresponde ao tipo declarado.');
      }
    }

    if (file.size > MAX_SIZE) {
      throw new BadRequestException('Arquivo muito grande. Tamanho máximo: 15MB.');
    }
  }

  static generateFileName(originalName: string): string {
    const ext = extname(originalName).toLowerCase();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}${ext}`;
  }
}
