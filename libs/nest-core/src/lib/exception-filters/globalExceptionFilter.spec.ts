import { ArgumentsHost, HttpException } from '@nestjs/common';
import { GlobalExceptionFilter } from './globalExceptionFilter';
import { Logger } from '@logging';
import { Exception } from '../custom-exception/customException';

jest.mock('@logging');

describe('Test global exception filter', () => {
  let globalExceptionFilter: GlobalExceptionFilter;
  let mockHost: any;
  let mockResponse: any;
  let mockRequest: any;
  let originalConsoleLog = console.log;

  beforeAll(() => {
    originalConsoleLog = console.log;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    globalExceptionFilter = new GlobalExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockRequest = {
      url: '/test',
      method: 'GET'
    };

    mockHost = {
      switchToHttp: jest.fn(() => ({
        getResponse: jest.fn(() => mockResponse),
        getRequest: jest.fn(() => mockRequest)
      }))
    };

    jest.spyOn(console, 'log').mockReset();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  it('Should catch a HttpException and return response to client', async () => {
    const mockHttpException = new HttpException('Test', 400);

    await globalExceptionFilter.catch(mockHttpException, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Test',
      timestamp: expect.any(String),
      path: '/test'
    });
  });

  it('Should initialise logger and call newLog for exception', async () => {
    const mockHttpException = new HttpException('Test', 503);

    await globalExceptionFilter.catch(mockHttpException, mockHost as ArgumentsHost);

    jest.spyOn(Logger.prototype, 'newLog');

    expect(Logger).toHaveBeenCalledWith('EXCEPTION');
    expect(Logger.prototype.newLog).toHaveBeenCalledTimes(1);
  });

  it('Should catch a CustomException and return response to client', async () => {
    const mockHttpException = new Exception('Test', 500, { alert: true });

    await globalExceptionFilter.catch(mockHttpException, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Test',
      timestamp: expect.any(String),
      path: '/test'
    });

    expect(console.log).toHaveBeenCalledWith('ALERTING');
  });

  it('Should catch a Generic error and return response to client', async () => {
    const mockHttpException = new Error();

    await globalExceptionFilter.catch(mockHttpException, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal server error',
      timestamp: expect.any(String),
      path: '/test'
    });
  });
});
