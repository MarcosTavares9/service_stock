import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

export type IconName =
  | 'laptop'
  | 'mouse'
  | 'headphones'
  | 'hdd'
  | 'memory'
  | 'chair'
  | 'print'
  | 'spray'
  | 'utensils'
  | 'tshirt'
  | 'box';

@Entity('categories')
@Unique(['name', 'user_id'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column({ name: 'icon_name' })
  icon_name: string;

  @Column({ default: EntityStatus.ACTIVE })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
