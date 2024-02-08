import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configSerive = app.get(ConfigService);
  const port = configSerive.get('port');
  await app.listen(port || 3000, '0.0.0.0');
}
bootstrap();
