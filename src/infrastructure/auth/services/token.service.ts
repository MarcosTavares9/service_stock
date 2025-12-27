import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '@domain/auth/ports/token.service.port';
import { randomBytes } from 'crypto';

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

