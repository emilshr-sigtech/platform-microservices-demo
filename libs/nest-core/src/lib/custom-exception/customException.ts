import { HttpException } from '@nestjs/common';
import { ErrorOptions } from './types';

/**
 * Extends the HttpException class to allow for custom error handling
 * and extended functionality, including alerting.
 *
 * @see [Built-in HTTP exception](https://docs.nestjs.com/exception-filters#built-in-http-exceptions)
 */
class CustomException extends HttpException {
  readonly fields?: string[];
  /**
   * Instantiaite a custom error which can throw an exception
   * a variety of status codes according to the user input.
   *
   * @example
   * `throw new Exception("You're not allowed", 403)`
   */

  constructor(message: any, status: number, options?: ErrorOptions) {
    super(message, status);

    if (message?.fields) this.fields = message.fields;
    if (options?.alert) this.sendAlert();
  }

  /**
   * Check if we should be alerted about the error.
   * If so, use global wrapper to push to the alerting queue.
   *
   * @param options - { alert?: boolean }
   */
  private sendAlert(): void {
    // TODO: Implement alerting
    console.log('ALERTING');
  }
}

export { CustomException as Exception };
