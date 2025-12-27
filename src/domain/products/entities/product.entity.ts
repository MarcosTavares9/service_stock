import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '@domain/categories/entities/category.entity';
import { Location } from '@domain/locations/entities/location.entity';

export enum ProductStatus {
  OK = 'ok',
  BAIXO = 'baixo',
  VAZIO = 'vazio',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  categoria: string;

  @Column({ type: 'int', default: 0 })
  quantidade: number;

  @Column({ type: 'int', default: 0 })
  estoqueMinimo: number;

  @Column()
  localizacao: string;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.VAZIO })
  status: ProductStatus;

  @Column({ nullable: true })
  imagem?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  calculateStatus(): ProductStatus {
    if (this.quantidade === 0) {
      return ProductStatus.VAZIO;
    }
    if (this.quantidade < this.estoqueMinimo) {
      return ProductStatus.BAIXO;
    }
    return ProductStatus.OK;
  }

  updateStatus(): void {
    this.status = this.calculateStatus();
  }
}

