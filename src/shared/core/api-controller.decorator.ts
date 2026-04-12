import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../modules/auth/jwt-auth.guard';
import { RolesGuard } from './roles.guard';

export function ApiController(tag: string) {
  return applyDecorators(ApiTags(tag), ApiBearerAuth(), UseGuards(JwtAuthGuard, RolesGuard));
}
