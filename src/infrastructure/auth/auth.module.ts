import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '@domain/auth/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { UserRepository } from './repositories/user.repository';
import { TokenService } from './services/token.service';
import { EmailService } from './services/email.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginUseCase } from '@application/auth/use-cases/login.use-case';
import { RegisterUseCase } from '@application/auth/use-cases/register.use-case';
import { ConfirmRegistrationUseCase } from '@application/auth/use-cases/confirm-registration.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'ITokenService',
      useClass: TokenService,
    },
    {
      provide: 'IEmailService',
      useClass: EmailService,
    },
    JwtStrategy,
    LoginUseCase,
    RegisterUseCase,
    ConfirmRegistrationUseCase,
  ],
  exports: ['IUserRepository', 'ITokenService', JwtStrategy],
})
export class AuthModule {}

