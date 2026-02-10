import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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
export class Category {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'icon_name' })
  icon_name: string;

  @Column({ default: EntityStatus.ACTIVE })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
