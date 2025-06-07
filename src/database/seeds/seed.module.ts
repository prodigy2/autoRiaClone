import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../roles/entities/permission.entity';
import { User } from '../../users/entities/user.entity';
import { CarBrand } from '../../cars/entities/car-brand.entity';
import { CarModel } from '../../cars/entities/car-model.entity';
import { CarAd } from '../../ads/entities/car-ad.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, User, CarBrand, CarModel, CarAd]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
