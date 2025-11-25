import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception?.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message;
    const stack = exception.stack;

    // 忽略浏览器开发工具和常见的探测请求
    const ignoredPaths = [
      '/.well-known/appspecific/com.chrome.devtools.json',
      '/favicon.ico',
    ];

    if (
      !ignoredPaths.includes(request.url) &&
      !request.url.startsWith('/.well-known/')
    ) {
      this.logger.error(
        `[${request.method}] ${request.url} ${status} ${message} ${stack}`,
      );
    }

    response.status(status).json({
      Code: -1,
      Message: message,
      Data: null,
      Time: new Date().toISOString(),
      Path: request.url,
    });
  }
}
