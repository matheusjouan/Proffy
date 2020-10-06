import {
  JoinColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Leasson from './Leasson';

@Entity('leasson_schedule')
class LeassonSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  week_day: number;

  @Column('int')
  from: number;

  @Column('int')
  to: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @JoinColumn({ name: 'leasson_id' })
  @ManyToOne(() => Leasson, leasson => leasson.leassonSchedule)
  leasson: Leasson;
}

export default LeassonSchedule;
