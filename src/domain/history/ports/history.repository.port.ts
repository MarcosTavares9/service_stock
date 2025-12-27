import { History, HistoryType } from '../entities/history.entity';

export interface CreateHistoryDto {
  tipo: HistoryType;
  produto: string;
  categoria: string;
  quantidade: number;
  quantidadeAnterior?: number;
  quantidadeNova?: number;
  usuario: string;
  observacao?: string;
}

export interface IHistoryRepository {
  create(dto: CreateHistoryDto): Promise<History>;
  findAll(params: {
    page: number;
    limit: number;
    tipo?: HistoryType;
    categoria?: string;
    produto?: string;
    usuario?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<{ history: History[]; total: number }>;
}

