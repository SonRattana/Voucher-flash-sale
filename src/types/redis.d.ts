import { EventEmitter } from 'events';

declare module 'ioredis' {
  interface Redis extends EventEmitter {
    on(
      event: 'message',
      listener: (channel: string, message: string) => void,
    ): this;
    on(
      event: 'pmessage',
      listener: (pattern: string, channel: string, message: string) => void,
    ): this;
    on(event: 'connect', listener: () => void): this;
    on(event: 'ready', listener: () => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'close', listener: () => void): this;
    on(event: 'reconnecting', listener: () => void): this;
    on(event: 'end', listener: () => void): this;
  }
}
