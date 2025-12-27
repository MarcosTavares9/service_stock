import { Injectable, Inject } from '@nestjs/common';
import { IHistoryRepository } from '@domain/history/ports/history.repository.port';
import { createObjectCsvWriter } from 'csv-writer';
import { HistoryType } from '@domain/history/entities/history.entity';

@Injectable()
export class ExportCsvUseCase {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async execute(params: {
    tipo?: HistoryType;
    categoria?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<string> {
    const { history } = await this.historyRepository.findAll({
      page: 1,
      limit: 10000,
      ...params,
    });

    const csvWriter = createObjectCsvWriter({
      path: 'temp-report.csv',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'tipo', title: 'Tipo' },
        { id: 'produto', title: 'Produto' },
        { id: 'categoria', title: 'Categoria' },
        { id: 'quantidade', title: 'Quantidade' },
        { id: 'usuario', title: 'Usuário' },
        { id: 'data', title: 'Data' },
        { id: 'observacao', title: 'Observação' },
      ],
    });

    await csvWriter.writeRecords(
      history.map((h) => ({
        id: h.id,
        tipo: h.tipo,
        produto: h.produto,
        categoria: h.categoria,
        quantidade: h.quantidade,
        usuario: h.usuario,
        data: h.data.toISOString(),
        observacao: h.observacao || '',
      })),
    );

    // TODO: Retornar buffer ou stream ao invés de arquivo temporário
    return 'temp-report.csv';
  }
}

