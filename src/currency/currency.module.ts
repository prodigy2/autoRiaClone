import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyRate } from './entities/currency-rate.entity';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([CurrencyRate]),
    ScheduleModule.forRoot(),
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
