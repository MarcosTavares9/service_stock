import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

export interface ITokenService {
  generateToken(payload: { id: string; email: string }): string;
  verifyToken(token: string): { id: string; email: string };
  generateConfirmationToken(): string;
}

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(payload: { id: string; email: string }): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): { id: string; email: string } {
    return this.jwtService.verify(token);
  }

  generateConfirmationToken(): string {
    return randomBytes(32).toString('hex');
  }
}
