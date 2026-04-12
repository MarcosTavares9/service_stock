import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

@Entity('locations')
@Unique(['name', 'user_id'])
export class Location {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: EntityStatus.ACTIVE })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
