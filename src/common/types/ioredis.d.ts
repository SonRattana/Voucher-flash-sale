declare module 'ioredis' {
  export default class Redis {
    publish(channel: string, message: string) {
      throw new Error('Method not implemented.');
    }
    subscribe(arg0: string, arg1: (err: any, count: any) => void) {
      throw new Error('Method not implemented.');
    }
    quit() {
      throw new Error('Method not implemented.');
    }
    ping(): any {
      throw new Error('Method not implemented.');
    }
    on(arg0: string, arg1: () => void) {
      throw new Error('Method not implemented.');
    }

    set(key: string, value: string, ...args: any[]): Promise<string>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<number>;
  }
}
