import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { CarAd } from '../../ads/entities/car-ad.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashed

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: 'base' })
  accountType: 'base' | 'premium';

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => CarAd, ad => ad.seller)
  ads: CarAd[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
