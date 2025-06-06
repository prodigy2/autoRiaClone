import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBrand } from './entities/car-brand.entity';
import { CarModel } from './entities/car-model.entity';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CarBrand, CarModel])],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
