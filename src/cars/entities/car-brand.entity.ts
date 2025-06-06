import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { CarModel } from './car-model.entity';

@Entity()
export class CarBrand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => CarModel, model => model.brand)
  models: CarModel[];
}
