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
  nome: string;

  @Column({ nullable: true })
  sobrenome?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ nullable: true })
  telefone?: string;

  @Column({ nullable: true })
  cnpj?: string;

  @Column({ type: 'enum', enum: UserRole, nullable: true })
  cargo?: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INATIVO })
  status: UserStatus;

  @Column({ nullable: true })
  fotoPerfil?: string;

  @Column({ nullable: true })
  confirmationToken?: string;

  @Column({ default: false })
  emailConfirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.senha && !this.senha.startsWith('$2b$')) {
      this.senha = await bcrypt.hash(this.senha, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.senha);
  }
}

