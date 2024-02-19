import { UserAuth } from '../types';

export interface TraceLog {
  environment: string;
  service: string;
  executionStartTime: Date;
  executionEndTime: Date | null;
  executionTime: number;
  correlationId: string | string[];
  response: {
    status: number;
    payload: any;
  };
  request: {
    requestId: string | string[];
    path: string;
    baseUrl: string;
    method: string;
    body: any;
    params: any;
    timestamp: string;
    context: {
      ipAddress?: string | string[];
      userAgent?: string;
    };
    user: UserAuth | 'Unauthenticated';
  };
}
