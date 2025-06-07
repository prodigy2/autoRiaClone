import { NestFactory } from '@nestjs/core';
import { CommandFactory } from 'nest-commander';
import { SeedCommandModule } from './seed-command.module';

async function bootstrap() {
  await CommandFactory.run(SeedCommandModule);
}

bootstrap();
