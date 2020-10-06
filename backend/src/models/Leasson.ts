import {
  PrimaryGeneratedColumn,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import User from './User';
import LeassonSchedule from './LeassonSchedule';

@Entity('leassons')
class Leasson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column('decimal')
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, user => user.leassons)
  user: User;

  @OneToMany(() => LeassonSchedule, leassonSchedule => leassonSchedule.leasson)
  leassonSchedule: LeassonSchedule[];
}

export default Leasson;
