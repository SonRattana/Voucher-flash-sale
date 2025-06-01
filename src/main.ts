import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(new TenantMiddleware().use.bind(new TenantMiddleware()));
  app.enableCors();
  app.use(json());
  await app.listen(3000);
}
bootstrap();
