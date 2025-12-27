import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum HistoryType {
  ENTRADA = 'entrada',
  SAIDA = 'saida',
  AJUSTE = 'ajuste',
  CRIACAO = 'criacao',
  EDICAO = 'edicao',
  EXCLUSAO = 'exclusao',
}

@Entity('history')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: HistoryType })
  tipo: HistoryType;

  @Column()
  produto: string;

  @Column()
  categoria: string;

  @Column({ type: 'int', default: 0 })
  quantidade: number;

  @Column({ type: 'int', nullable: true })
  quantidadeAnterior?: number;

  @Column({ type: 'int', nullable: true })
  quantidadeNova?: number;

  @Column()
  usuario: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data: Date;

  @Column({ nullable: true })
  observacao?: string;

  @CreateDateColumn()
  createdAt: Date;
}

