import { Injectable, Logger } from '@nestjs/common';
import { IEmailService } from '@domain/auth/ports/email.service.port';

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendConfirmationEmail(
    email: string,
    token: string,
    name: string,
  ): Promise<void> {
    // TODO: Implementar serviço de email real (SendGrid, AWS SES, etc)
    // Por enquanto, apenas log
    const confirmationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/confirm-registration/${token}`;
    
    this.logger.log(`Email de confirmação para ${email}:`);
    this.logger.log(`URL: ${confirmationUrl}`);
    
    // Em produção, usar serviço de email real
    // await this.emailClient.send({
    //   to: email,
    //   subject: 'Confirme sua conta',
    //   html: `Olá ${name}, clique no link para confirmar: ${confirmationUrl}`,
    // });
  }
}

