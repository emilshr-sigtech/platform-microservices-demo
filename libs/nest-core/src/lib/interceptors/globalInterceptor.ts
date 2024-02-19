import { Logger } from '@logging';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TraceLog } from './types';
import { UserAuth } from '../types';
import { Request, Response } from 'express';
import { decodeJwt } from '@utils';
/**
 * @fileoverview
 * The global interceptor traces all requests and responses
 * handled by the application and logs them to the logging
 * service queue, using the @logging package. These logs are
 * for traceability and high-level monitoring of the application.
 */

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  private logger = new Logger('TRACE');

  private readonly environment: string = process.env['NODE_ENV'] || 'Unknown';
  private service: string = '';
  private executionTimes: { start: Date; end: Date | null; duration: number } = {
    start: new Date(),
    end: null,
    duration: 0
  };
  private correlationId: string | string[] = '';
  private response = {
    status: 500,
    payload: {}
  };
  private requestId: string | string[] = '';
  private path: string = '';
  private baseUrl: string = '';
  private method: string = '';
  private body: any = {};
  private params: any = {};
  private timestamp: string = '';
  private context = {
    ipAddress: '',
    userAgent: ''
  };
  private user: UserAuth | 'Unauthenticated' = 'Unauthenticated';

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    this.executionTimes.start = new Date();
    this.user = await this.getUserAuth(request);
    this.correlationId = request?.headers?.['x-correlation-id'] || '';
    this.requestId = request?.headers?.['x-request-id'] || '';
    this.path = request.url;
    this.method = request.method;
    this.body = request.body;
    this.params = request.params;
    this.timestamp = new Date().toISOString();
    this.context = {
      ipAddress: request?.connection?.remoteAddress || 'Unknown',
      userAgent: request?.headers?.['user-agent'] || 'Unknown'
    };

    // Get base url of request
    if (request.baseUrl) {
      this.baseUrl = request.baseUrl;
    } else if (request.headers && request.headers?.host?.includes('localhost')) {
      this.baseUrl = 'localhost';
    }

    return next.handle().pipe(
      catchError(err => {
        this.executionTimes.end = new Date();
        this.service = this.getServiceNameFromErrorStack(err.stack);

        this.sendLog(err.status, err.stack);

        return throwError(() => err);
      }),
      tap(data => {
        this.executionTimes.end = new Date();
        this.service = this.getServiceNameFromErrorStack(new Error().stack as string);

        this.sendLog(response.statusCode, data);

        return data;
      })
    );
  }

  private sendLog(status?: number, payload?: any) {
    const executionEndTime = new Date();
    this.executionTimes = {
      ...this.executionTimes,
      end: executionEndTime,
      duration: executionEndTime.getTime() - this.executionTimes.start.getTime()
    };

    const traceLog: TraceLog = {
      environment: this.environment,
      service: this.service,
      executionStartTime: this.executionTimes.start,
      executionEndTime: this.executionTimes.end,
      executionTime: this.executionTimes.duration,
      correlationId: this.correlationId,
      response: {
        status: status || this.response.status,
        payload: payload || this.response.payload
      },
      request: {
        requestId: this.requestId,
        path: this.path,
        baseUrl: this.baseUrl,
        method: this.method,
        body: this.body,
        params: this.params,
        timestamp: this.timestamp,
        context: this.context,
        user: this.user
      }
    };

    this.logger.newLog(traceLog);
  }

  public getServiceNameFromErrorStack(stackTrace: string): string {
    /**
     * Extracts the service name from the error stack trace. This is the
     * service that the request called, not necessarily the service that
     * originally threw the error or handled the request.
     *
     * @param { string } stackTrace - Stack trace from an error
     * @returns { string } - The name of the service that threw the error
     */

    const lines = stackTrace.split('\n');
    let filePathWithLineNumber: string[] | string = lines
      .map(line => line.toString().trim())
      .filter(line => line.startsWith('at'));

    if (filePathWithLineNumber.length === 0) {
      return 'Unknown';
    } else {
      filePathWithLineNumber = filePathWithLineNumber[0].replace('at', '');
    }

    const partOfBuild = filePathWithLineNumber.includes('/dist/apps');
    const serviceName = filePathWithLineNumber
      .split('/dist/apps/')
      [partOfBuild ? 1 : 0].split('/')[0];

    return serviceName;
  }

  private async getUserAuth(request: Request): Promise<TraceLog['request']['user']> {
    /**
     * Extracts the user authentication details from the request headers
     * and parses the access token to get the user details.
     *
     * @param { Request } request - The request object
     * @returns { UserAuth | "Unauthenticated" } - The user authentication details
     */

    if (request?.headers?.authorization) {
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
}
