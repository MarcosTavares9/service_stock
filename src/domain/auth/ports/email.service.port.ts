export interface IEmailService {
  sendConfirmationEmail(email: string, token: string, name: string): Promise<void>;
}

