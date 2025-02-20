import { serverEnv } from '@/env/server';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  level?: LogLevel;
  timestamp?: boolean;
  prefix?: string;
  meta?: Record<string, any>;
}


class Logger {
  private static instance: Logger;
  private readonly isDebugEnabled: boolean;

  private constructor() {
    this.isDebugEnabled = typeof window === 'undefined' ? 
      (process.env.NODE_ENV === 'development' || serverEnv.DEBUG === 'true') : 
      process.env.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(message: any, options: LogOptions = {}): string {
    const timestamp = options.timestamp ? `[${new Date().toISOString()}] ` : '';
    const prefix = options.prefix ? `[${options.prefix}] ` : '';
    const level = options.level ? `[${options.level.toUpperCase()}] ` : '';
    
    let formattedMessage = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
    if (options.meta) {
      formattedMessage = typeof formattedMessage === 'string' ? `${formattedMessage} ${JSON.stringify(options.meta, null, 2)}` : JSON.stringify({ message: formattedMessage, ...options.meta }, null, 2);
    }
    
    return `${timestamp}${level}${prefix}${formattedMessage}`;
  }

  public debug(message: any, options: LogOptions = { level: 'debug' }): void {
    if (this.isDebugEnabled) {
      console.log(this.formatMessage(message, { ...options, level: 'debug' }));
    }
  }

  public info(message: any, options: LogOptions = { level: 'info' }): void {
    console.info(this.formatMessage(message, { ...options, level: 'info' }));
  }

  public warn(message: any, options: LogOptions = { level: 'warn' }): void {
    console.warn(this.formatMessage(message, { ...options, level: 'warn' }));
  }

  public error(message: any, options: LogOptions = { level: 'error' }): void {
    console.error(this.formatMessage(message, { ...options, level: 'error' }));
  }
}

export const logger = Logger.getInstance();