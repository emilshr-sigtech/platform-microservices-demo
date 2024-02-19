import { TraceLog } from '@nest-core/types';

/**
 * A stream that will handle all trace logs that are
 * generated in any microservice. The stream will send
 * the trace log to the logging service queue to be
 * persisted.
 */

export class TraceStream {
  private traceLog?: TraceLog;

  public createLog(traceLog: TraceLog) {
    this.traceLog = traceLog;
    this.sendLogToQueue();
  }

  private sendLogToQueue() {
    // Send the trace log to the logging service queue
    //console.log(this.traceLog)
  }
}
