import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

export interface ITokenService {
  generateToken(payload: { id: string; email: string; role: string }): string;
  verifyToken(token: string): { id: string; email: string; role: string };
  generateConfirmationToken(payload: { email: string }): string;
  verifyConfirmationToken(token: string): { email: string };
}

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(payload: { id: string; email: string; role: string }): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): { id: string; email: string; role: string } {
    return this.jwtService.verify(token);
  }

  generateConfirmationToken(payload: { email: string }): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.sign(
      { email: payload.email, type: 'confirm_registration' },
      {
        secret,
        expiresIn: '24h',
        jwtid: randomBytes(8).toString('hex'),
      },
    );
  }

  verifyConfirmationToken(token: string): { email: string } {
    const secret = this.configService.get<string>('JWT_SECRET');
    const decoded = this.jwtService.verify(token, { secret }) as {
      email: string;
      type?: string;
    };

    if (decoded.type !== 'confirm_registration') {
      throw new Error('Tipo de token inválido');
    }

    return { email: decoded.email };
  }
}
