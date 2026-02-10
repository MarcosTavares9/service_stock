import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EntityStatus } from '../../shared/utils/entity-status.enum';

export enum UserRole {
  ADMINISTRADOR = 'Administrador',
  GERENTE = 'Gerente',
  OPERADOR = 'Operador',
}

export enum UserStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'last_name', nullable: true })
  last_name?: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  profile_picture?: string;

  @Column({ default: EntityStatus.INACTIVE })
  status: string;

  @Column({ name: 'email_confirmed', default: false })
  email_confirmed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
