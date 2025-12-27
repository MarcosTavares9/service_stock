import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';

export function ApiController(tag: string) {
  return applyDecorators(
    ApiTags(tag),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
  );
}

