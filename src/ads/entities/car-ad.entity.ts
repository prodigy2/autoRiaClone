import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarModel } from '../../cars/entities/car-model.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class CarAd {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: 'USD' | 'EUR' | 'UAH';

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceUSD: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceEUR: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceUAH: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  exchangeRateUSD: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  exchangeRateEUR: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  exchangeRateUAH: number;

  @Column()
  year: number;

  @Column()
  mileage: number;

  @ManyToOne(() => CarModel)
  model: CarModel;

  @ManyToOne(() => User, user => user.ads)
  seller: User;

  @Column({ default: 'pending' })
  status: 'pending' | 'active' | 'rejected' | 'sold';

  @Column({ default: 0 })
  rejectionCount: number;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
