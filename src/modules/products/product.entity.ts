import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Location } from '../locations/location.entity';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

export enum ProductStatus {
  OK = 'ok',
  LOW = 'low',
  EMPTY = 'empty',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ name: 'category_id', type: 'uuid' })
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'location_id', type: 'uuid' })
  location_id: string;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ name: 'minimum_stock', type: 'int', default: 0 })
  minimum_stock: number;

  @Column({ name: 'stock_status', default: 'empty' })
  stock_status: string;

  @Column({ default: EntityStatus.ACTIVE })
  status: string;

  @Column({ nullable: true })
  image?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  calculateStatus(): ProductStatus {
    if (this.quantity <= 0) {
      return ProductStatus.EMPTY;
    }
    if (this.quantity < this.minimum_stock) {
      return ProductStatus.LOW;
    }
    return ProductStatus.OK;
  }

  updateStockStatus(): void {
    const newStockStatus = this.calculateStatus();
    this.stock_status = newStockStatus;
  }
}
