/**
 * A stream that prints log messages to the console
 * for debugging purposes. Logs that are published
 * to this stream will not be persisted and are used
 * for local debugging purposes only.
 */

export class DebugStream {
  private sourcePath: string = '';
  private sourceLine: number = 0;
  private sourceFunction: string = '';

  public printLog(logContent: any) {
    this.getDebugSource(logContent);

    const reset = '\x1b[0m';
    const blue = (text: string) => `\x1b[34m${text}${reset}`;
    const yellow = (text: string) => `\x1b[33m${text}${reset}`;

    console.log(
      blue('[DEBUG]  -') +
        '  ' +
        new Date().toLocaleString('en-GB') +
        '    ' +
        blue('LOG') +
        ' ' +
        yellow(`[${this.sourceFunction}]`) +
        ' ' +
        blue(`${this.sourcePath} at line ${this.sourceLine}:\n`),
      logContent
    );
  }

  private getDebugSource(logContent: any) {
    /**
     * Extract the nested path from a stack trace to identify the source of the log message
     *
     * @param { any } logContent - The content of the log message
     * @returns { string } - The path of the file that the log message originated from
     */

    const stackTrace = new Error(logContent).stack;
    const lines = stackTrace?.split('\n');

    const filePathWithLineNumber: string = (lines as string[])
      .map(line => line.toString().trim())
      .filter(
        line =>
          line.startsWith('at') && !line.includes('LoggingUtil') && !line.includes('DebugStream')
      )[0]
      .replace('at ', '');

    const containsLineNumber = filePathWithLineNumber.match(/([^:]+:\d+:\d+)/);

    // Extract function/class/method name from stack trace
    this.sourceFunction = filePathWithLineNumber.split(' ')[0];

    // Extract the source path and line number from the stack trace
    if (containsLineNumber) {
      const [filePath, lineNumber] = containsLineNumber[0].split(':');
      this.sourcePath = filePath;
      this.sourceLine = parseInt(lineNumber);
    } else {
      this.sourcePath = filePathWithLineNumber;
    }
  }
}
