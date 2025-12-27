import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nome: string;

  @Column({
    type: 'enum',
    enum: [
      'laptop',
      'mouse',
      'headphones',
      'hdd',
      'memory',
      'chair',
      'print',
      'spray',
      'utensils',
      'tshirt',
      'box',
    ],
  })
  iconName: IconName;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

