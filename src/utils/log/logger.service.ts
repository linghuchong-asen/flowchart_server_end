import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

class LoggerService {
  private logPath = path.join(__dirname, 'error.log');

  error(message: string, context?: string) {
    const logMessage = `[${new Date().toISOString()}] ERROR [${
      context || 'unknown'
    }]: ${message}\n`;
    this.writeLog(logMessage);
  }

  private writeLog(message: string) {
    fs.appendFile(this.logPath, message, (err) => {
      if (err) {
        Logger.error('Failed to write to log file:', err);
      }
    });
  }
}

export default new LoggerService();
