import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../shared/config/app.config';

export interface IEmailService {
  sendConfirmationEmail(email: string, token: string, name: string): Promise<void>;
}

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendConfirmationEmail(email: string, token: string, name: string): Promise<void> {
    const appUrl = AppConfig.getAppUrl(this.configService);
    const confirmationUrl = `${appUrl}/api/auth/confirm-registration/${token}`;

    this.logger.log(`Email de confirmação para ${email}:`);
    this.logger.log(`URL: ${confirmationUrl}`);
  }
}
