import { TypeOrmModule } from '@nestjs/typeorm';

TypeOrmModule.forRoot({
  type: 'postgres', // ✅ BẮT BUỘC PHẢI CÓ
  host: '127.0.0.1',
  port: 5433,
  username: 'postgres',
  password: 'natv1211212212',
  database: 'voucher',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
});
