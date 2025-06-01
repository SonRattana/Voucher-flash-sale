// // src/redis/providers/redis.provider.ts
// import {
//   Injectable,
//   OnModuleInit,
//   OnModuleDestroy,
//   Logger,
// } from '@nestjs/common';
// import Redis from 'ioredis';
// import { redisConnections } from '../config/redis.config';

// @Injectable()
// export class RedisProvider implements OnModuleInit, OnModuleDestroy {
//   private readonly logger = new Logger(RedisProvider.name);

//   public cache: Redis;
//   public publisher: Redis;
//   public subscriber: Redis;
//   public lock: Redis;
//   public session: Redis;

//   async onModuleInit() {
//     try {
//       // Initialize different Redis connections
//       this.cache = new Redis(redisConnections.cache);
//       this.publisher = new Redis(redisConnections.publisher);
//       this.subscriber = new Redis(redisConnections.subscriber);
//       this.lock = new Redis(redisConnections.lock);
//       this.session = new Redis(redisConnections.session);

//       // Setup event handlers
//       this.setupEventHandlers();

//       this.logger.log('✅ All Redis connections established');
//     } catch (error) {
//       this.logger.error('❌ Failed to initialize Redis connections:', error);
//       throw error;
//     }
//   }

//   async onModuleDestroy() {
//     const connections = [
//       this.cache,
//       this.publisher,
//       this.subscriber,
//       this.lock,
//       this.session,
//     ];

//     await Promise.all(
//       connections.map(async (connection) => {
//         if (connection) {
//           await connection.quit();
//         }
//       }),
//     );

//     this.logger.log('🔌 All Redis connections closed');
//   }

//   private setupEventHandlers() {
//     const connections = {
//       cache: this.cache,
//       publisher: this.publisher,
//       subscriber: this.subscriber,
//       lock: this.lock,
//       session: this.session,
//     };

//     Object.entries(connections).forEach(([name, connection]) => {
//       connection.on('connect', () => {
//         this.logger.log(`🔗 Redis ${name} connected`);
//       });

//       connection.on('ready', () => {
//         this.logger.log(`✅ Redis ${name} ready`);
//       });

//       connection.on('error', (error) => {
//         this.logger.error(`❌ Redis ${name} error:`, error);
//       });

//       connection.on('close', () => {
//         this.logger.warn(`🔌 Redis ${name} connection closed`);
//       });

//       connection.on('reconnecting', () => {
//         this.logger.log(`🔄 Redis ${name} reconnecting...`);
//       });
//     });
//   }

//   // Health check method
//   async healthCheck(): Promise<boolean> {
//     try {
//       await Promise.all([
//         this.cache.ping(),
//         this.publisher.ping(),
//         this.lock.ping(),
//       ]);
//       return true;
//     } catch (error) {
//       this.logger.error('❌ Redis health check failed:', error);
//       return false;
//     }
//   }
// }
