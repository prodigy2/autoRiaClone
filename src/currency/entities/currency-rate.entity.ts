import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CurrencyRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  baseCurrency: string;

  @Column()
  targetCurrency: string;

  @Column('decimal', { precision: 10, scale: 4 })
  rate: number;

  @Column()
  date: Date;
}
