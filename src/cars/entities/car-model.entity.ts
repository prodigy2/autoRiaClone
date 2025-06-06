import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { CarBrand } from './car-brand.entity';

@Entity()
export class CarModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => CarBrand, brand => brand.models)
  brand: CarBrand;
}
