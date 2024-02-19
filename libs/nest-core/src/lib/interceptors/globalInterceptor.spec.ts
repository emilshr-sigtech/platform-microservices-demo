import { GlobalInterceptor } from './globalInterceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Logger } from '@logging';
import { lastValueFrom, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { Exception } from '../custom-exception/customException';

jest.mock('@logging');

describe('Test global interceptor', () => {
  let globalInterceptor: GlobalInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    jest.clearAllMocks();

    globalInterceptor = new GlobalInterceptor();

    mockExecutionContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({})),
        getResponse: jest.fn(() => ({}))
      }))
    } as unknown as ExecutionContext;

    mockCallHandler = {
      handle: jest.fn(() => of('Mock response'))
    } as CallHandler;
  });

  it('Should intercept the request and response without errors', async () => {
    const oberservableResult = await globalInterceptor.intercept(
      mockExecutionContext,
      mockCallHandler
    );
    const result = await lastValueFrom(oberservableResult);

    expect(result).toBe('Mock response');
  });

  it('Should intercept the request and response with errors', async () => {
    mockCallHandler = {
      handle: jest.fn(() => throwError(() => new Exception('Mock error', 400)))
    } as CallHandler;

    const spyLoggerNewLog = jest.spyOn(Logger.prototype, 'newLog');

    expect(Logger).toHaveBeenCalledWith('TRACE');

    try {
      const oberservableResult = await globalInterceptor.intercept(
        mockExecutionContext,
        mockCallHandler
      );
      await lastValueFrom(oberservableResult);
    } catch (err: any) {
      expect(err?.message).toBe('Mock error');
      expect(spyLoggerNewLog).toHaveBeenCalledWith(
        expect.objectContaining({
          environment: 'test',
          request: expect.objectContaining({
            user: 'Unauthenticated'
          }),
          response: expect.objectContaining({
            status: 400,
            payload: expect.stringContaining('CustomException: Mock error')
          })
        })
      );
    }
  });

  it('Should extract service name from error stack trace', () => {
    const stackTrace = `Error: 
            at Object.next (/Users/elliot.gnecco/Documents/platform-microservices-v2/dist/apps/deployment/webpack:/libs/nest-core/src/lib/interceptors/globalInterceptor.ts:86:71)
            at /Users/elliot.gnecco/Documents/platform-microservices-v2/node_modules/rxjs/src/internal/operators/tap.ts:189:31
            at OperatorSubscriber._this._next (/Users/elliot.gnecco/Documents/platform-microservices-v2/node_modules/rxjs/src/internal/operators/OperatorSubscriber.ts:70:13)
            at OperatorSubscriber.Subscriber.next (/Users/elliot.gnecco/Documents/platform-microservices-v2/node_modules/rxjs/src/internal/Subscriber.ts:75:12)
        `;

    const serviceName = globalInterceptor.getServiceNameFromErrorStack(stackTrace);

    expect(serviceName).toBe('deployment');
  });
});
