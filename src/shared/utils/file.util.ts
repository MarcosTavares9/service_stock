import { extname } from 'path';

export class FileUtil {
  static validateImage(file: Express.Multer.File): void {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 15 * 1024 * 1024; // 15MB

    if (!allowedMimes.includes(file.mimetype)) {
      throw new Error('Formato de arquivo inválido. Use PNG ou JPEG.');
    }

    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 15MB.');
    }
  }

  static generateFileName(originalName: string): string {
    const ext = extname(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}${ext}`;
  }
}

