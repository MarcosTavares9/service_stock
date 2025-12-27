export interface ITokenService {
  generateToken(payload: { id: string; email: string }): string;
  verifyToken(token: string): { id: string; email: string };
  generateConfirmationToken(): string;
}

