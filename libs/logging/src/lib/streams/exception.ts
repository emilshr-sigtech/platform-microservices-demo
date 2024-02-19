import { ExceptionLog } from '@nest-core/types';
import { promises as fs } from 'fs';

const path = require('path');
const lockfile = require('proper-lockfile');
/**
 * A stream that will handle all HTTP & generic exceptions
 * that are thrown in any microservice. The stream will
 * send the exception to the logging service queue to be
 * persisted.
 */

// TODO - Send the exception to the logging service queue

export class ExceptionStream {
  private exceptionLog?: ExceptionLog;

  public createLog(exceptionLog: ExceptionLog) {
    this.exceptionLog = exceptionLog;

    // ! This can be uncommented to mock a write to local storage if directory is created
    //this.writeLogToLocalStorage();
  }

  private async writeLogToLocalStorage() {
    const logStore = path.join(__dirname, './logs/log-store.txt');

    // Write the exception log to local storage
    try {
      lockfile
        .lock(logStore, { retries: { retries: 10, maxTimeout: 1000 } })
        .then(async () => {
          const dataToWrite = JSON.stringify(this.exceptionLog);

          fs.appendFile(logStore, `${dataToWrite}\n`);

          return lockfile.unlock(logStore);
        })
        .catch((err: any) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  }
}
