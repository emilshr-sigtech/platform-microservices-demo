import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionLog } from './types';
import { decodeJwt } from '@utils';
import { Logger } from '@logging';
import { Exception } from '../custom-exception/customException';

type AcceptedError = Exception | Error | HttpException;

/**
 * @fileoverview
 * The global exception filter handles all exceptions thrown by the application
 * and handles the response to the client in a structured manner. It also handles
 * the persistance of the log by sending it to the logging service queue, using
 * the @logging package.
 */

@Catch(Error, HttpException, Exception)
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger('EXCEPTION');

  async catch(exception: AcceptedError, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message || 'Internal server error';
    let baseUrl = 'Unknown';
    let userAuth: ExceptionLog['user'] = 'Unauthenticated';

    let optionalInformation: { [key: string]: any } = {};

    // Get base url of request
    if (request.baseUrl) {
      baseUrl = request.baseUrl;
    } else if (request.headers && request.headers.host?.includes('localhost')) {
      baseUrl = 'localhost';
    }

    // If validation fields are present
    if (exception instanceof Exception && exception.fields)
      optionalInformation['fields'] = exception.fields;

    // Get user auth
    userAuth = await this.getUserAuth(request);

    // Get file path of where the error originated from trace
    const filePath = this.extractFileOriginFromTrace(exception.stack || '');

    // Prepare exception log to be sent to logging service
    const exceptionLog: ExceptionLog = {
      status: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      baseUrl: baseUrl,
      method: request.method,
      fileSource: filePath,
      user: userAuth,
      error: exception,
      body: request.body,
      params: request.params,
      context: {
        ipAddress: request?.connection?.remoteAddress || 'Unknown',
        userAgent: request?.headers?.['user-agent'] || 'Unknown'
      }
    };

    // Send exception log to logging service
    this.logger.newLog(exceptionLog);

    // Handle response that will be return to client
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      ...optionalInformation
    });
  }

  private async getUserAuth(request: Request): Promise<ExceptionLog['user']> {
    if (request.headers && request.headers.authorization) {
      const accessToken = request?.headers?.authorization.split(' ')[1];

      try {
        const decodedToken = await decodeJwt(accessToken);
        const { iat, ...user } = decodedToken;

        return {
          ...user,
          accessToken: accessToken
        };
      } catch {
        return 'Unauthenticated';
      }
    } else {
      return 'Unauthenticated';
    }
  }

  private extractFileOriginFromTrace(stackTrace: string): string {
    /*
     *  Extract file path from a stack trace to identify the source of an error
     *
     *  @param { string } stackTrace - Stack trace from an error
     *  @returns { string } - The path of the file that the error originated from
     */

    const lines = stackTrace.split('\n');
    const filePathWithLineNumber: string = lines
      .map(line => line.toString().trim())
      .filter(line => line.startsWith('at'))[0]
      .replace('at ', '');

    const containsLineNumber = filePathWithLineNumber.match(/([^:]+:\d+:\d+)/);

    if (containsLineNumber) {
      const [filePath, lineNumber] = containsLineNumber[0].split(':');
      return filePath;
    } else {
      return filePathWithLineNumber;
    }
  }
}
