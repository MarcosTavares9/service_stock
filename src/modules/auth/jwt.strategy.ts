import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from './user.repository';
import { AppConfig } from '../../shared/config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfig.getJwtSecret(configService),
    });
  }

  async validate(payload: { id: string; email: string }) {
    const user = await this.userRepository.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const activeStatus = 'true';
    if (user.status !== activeStatus) {
      throw new UnauthorizedException(`Usuário não está ativo. Status atual: ${user.status}`);
    }

    return { id: user.id, email: user.email };
  }
}
