import { HttpException } from '@nestjs/common';
import { Headers } from '@nestjs/common';
import { UserAuth } from '../types';

export interface ExceptionLog {
  status: number;
  //requestId: string,
  message: string;
  timestamp: string;
  path: string;
  baseUrl: string;
  method: string;
  fileSource: string;
  user: UserAuth | 'Unauthenticated';
  error: HttpException | Error;
  body: any;
  params: any;
  context: {
    ipAddress?: string | string[];
    userAgent?: string;
  };
}
