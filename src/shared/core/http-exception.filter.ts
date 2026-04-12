import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let primaryMessage: string | string[] = 'Erro interno do servidor';
    let details: Record<string, any> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        primaryMessage = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        primaryMessage = responseObj.message ?? responseObj.error ?? primaryMessage;
        details = responseObj.details;
      }
    } else if (exception instanceof Error) {
      primaryMessage = exception.message;
    }

    const errorArray: string[] = Array.isArray(primaryMessage)
      ? primaryMessage.filter((m) => typeof m === 'string')
      : [String(primaryMessage)];

    if (status >= 500) {
      this.logger.error(primaryMessage, (exception as any)?.stack);
    } else {
      this.logger.warn(primaryMessage);
    }

    response.status(status).json({
      error: errorArray,
      message: errorArray[0] ?? 'Erro',
      ...(details && { details }),
      statusCode: status,
      timestamp: new Date().toISOString(),
      ...(request?.url ? { path: request.url } : {}),
    });
  }
}
