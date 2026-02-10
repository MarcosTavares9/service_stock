import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

export enum HistoryType {
  ENTRY = 'entry',
  EXIT = 'exit',
  ADJUSTMENT = 'adjustment',
}

@Entity('history')
export class History {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  type: string;

  // Sem FK — tabela de auditoria deve manter o UUID mesmo após deleção do produto
  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  product_id?: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  user_id?: string;

  @Column({ name: 'categories_id', type: 'uuid', nullable: true })
  categories_id?: string;

  @Column({ name: 'locations_id', type: 'uuid', nullable: true })
  locations_id?: string;

  @Column({ name: 'quantity_changed', type: 'int' })
  quantity_changed: number;

  @Column({ name: 'previous_quantity', type: 'int', nullable: true })
  previous_quantity?: number;

  @Column({ name: 'new_quantity', type: 'int', nullable: true })
  new_quantity?: number;

  @Column({ nullable: true })
  observation?: string;

  @Column({ default: EntityStatus.ACTIVE })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
