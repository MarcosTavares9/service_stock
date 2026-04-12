import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, statusCode);
  }
}

export class NotFoundException extends BusinessException {
  constructor(resource: string) {
    super(`${resource} n�o encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedException extends BusinessException {
  constructor(message: string = 'N�o autorizado') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ConflictException extends BusinessException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class ForbiddenException extends BusinessException {
  constructor(message: string = 'Acesso negado') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class BadRequestException extends BusinessException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
