import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { LocationsModule } from './modules/locations/locations.module';
import { UsersModule } from './modules/users/users.module';
import { HistoryModule } from './modules/history/history.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DatabaseConfig } from './shared/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      expandVariables: true,
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(3000),
        FRONTEND_URL: Joi.string().uri().optional(),
        ALLOWED_ORIGINS: Joi.string().optional(),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        DATABASE_URL: Joi.string().uri().optional(),
        DB_URL: Joi.string().uri().optional(),
        DB_HOST: Joi.string().hostname().optional(),
        DB_PORT: Joi.number().port().optional(),
        DB_USERNAME: Joi.string().optional(),
        DB_PASSWORD: Joi.string().optional(),
        DB_DATABASE: Joi.string().optional(),
        DB_SYNCHRONIZE: Joi.string().valid('true', 'false').optional(),
        JWT_SECRET: Joi.string().min(16).required(),
        UPLOAD_PATH: Joi.string().optional(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    AuthModule,
    ProductsModule,
    CategoriesModule,
    LocationsModule,
    UsersModule,
    HistoryModule,
    DashboardModule,
    ReportsModule,
  ],
})
export class AppModule {}
