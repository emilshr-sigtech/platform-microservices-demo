import { LogType } from './types';

// Stream classes
import { DebugStream } from './streams/debug';
import { ExceptionStream } from './streams/exception';
import { TraceStream } from './streams/trace';

class LoggingUtil {
  private logStream: LogType;

  // Stream of logs to be sent to the logging service
  private debugStream = new DebugStream();
  private exceptionStream = new ExceptionStream();
  private traceStream = new TraceStream();

  constructor(logStream: LogType) {
    this.logStream = logStream;
  }

  /**
   * Entry point of a new log message
   * Logs are sent to the appropriate stream based on the logStream property
   * unless the logStream is "DEBUG" in which case the log is sent to the console
   */
  public newLog(logContent: any) {
    switch (this.logStream) {
      case 'DEBUG':
        this.debugStream.printLog(logContent);
        break;

      case 'EXCEPTION':
        this.exceptionStream.createLog(logContent);
        break;

      case 'TRACE':
        this.traceStream.createLog(logContent);
        break;

      default:
        break;
    }
  }
}

export { LoggingUtil as Logger };
