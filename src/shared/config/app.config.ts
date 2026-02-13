import { ConfigService } from '@nestjs/config';

export class AppConfig {
  static getPort(configService: ConfigService): number {
    return configService.get<number>('PORT', 3000);
  }

  static getFrontendUrls(configService: ConfigService): string[] {
    const frontendUrl = configService.get<string>('FRONTEND_URL');
    const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS');

    if (allowedOrigins) {
      return allowedOrigins.split(',').map((url) => url.trim());
    }

    const defaultUrls = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];

    return frontendUrl ? [...defaultUrls, frontendUrl] : defaultUrls;
  }

  static getAppUrl(configService: ConfigService): string {
    return configService.get<string>('APP_URL', 'http://localhost:3000');
  }

  static getJwtSecret(configService: ConfigService): string {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET não configurado. Configure a variável de ambiente JWT_SECRET.');
    }
    return secret;
  }

  static getMaxListLimit(): number {
    return Number.MAX_SAFE_INTEGER;
  }

  static getUploadPath(): string {
    return process.env.UPLOAD_PATH || '/uploads';
  }

  static getProductsUploadPath(): string {
    return `${this.getUploadPath()}/products`;
  }

  static getUsersUploadPath(): string {
    return `${this.getUploadPath()}/users`;
  }
}
