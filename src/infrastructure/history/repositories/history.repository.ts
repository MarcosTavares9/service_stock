import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { History, HistoryType } from '@domain/history/entities/history.entity';
import {
  IHistoryRepository,
  CreateHistoryDto,
} from '@domain/history/ports/history.repository.port';

@Injectable()
export class HistoryRepository implements IHistoryRepository {
  constructor(
    @InjectRepository(History)
    private readonly repository: Repository<History>,
  ) {}

  async create(dto: CreateHistoryDto): Promise<History> {
    const history = new History();
    history.tipo = dto.tipo;
    history.produto = dto.produto;
    history.categoria = dto.categoria;
    history.quantidade = dto.quantidade;
    history.quantidadeAnterior = dto.quantidadeAnterior;
    history.quantidadeNova = dto.quantidadeNova;
    history.usuario = dto.usuario;
    history.observacao = dto.observacao;
    history.data = new Date();

    return this.repository.save(history);
  }

  async findAll(params: {
    page: number;
    limit: number;
    tipo?: HistoryType;
    categoria?: string;
    produto?: string;
    usuario?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<{ history: History[]; total: number }> {
    const { page, limit, tipo, categoria, produto, usuario, dataInicio, dataFim } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('history');

    if (tipo) {
      queryBuilder.andWhere('history.tipo = :tipo', { tipo });
    }

    if (categoria) {
      queryBuilder.andWhere('history.categoria = :categoria', { categoria });
    }

    if (produto) {
      queryBuilder.andWhere('history.produto ILIKE :produto', {
        produto: `%${produto}%`,
      });
    }

    if (usuario) {
      queryBuilder.andWhere('history.usuario ILIKE :usuario', {
        usuario: `%${usuario}%`,
      });
    }

    if (dataInicio && dataFim) {
      queryBuilder.andWhere('history.data BETWEEN :dataInicio AND :dataFim', {
        dataInicio,
        dataFim,
      });
    } else if (dataInicio) {
      queryBuilder.andWhere('history.data >= :dataInicio', { dataInicio });
    } else if (dataFim) {
      queryBuilder.andWhere('history.data <= :dataFim', { dataFim });
    }

    const [history, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('history.data', 'DESC')
      .getManyAndCount();

    return { history, total };
  }
}

