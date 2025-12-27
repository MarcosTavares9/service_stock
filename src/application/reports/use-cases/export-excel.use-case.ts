import { Injectable, Inject } from '@nestjs/common';
import { IHistoryRepository } from '@domain/history/ports/history.repository.port';
import * as ExcelJS from 'exceljs';
import { HistoryType } from '@domain/history/entities/history.entity';

@Injectable()
export class ExportExcelUseCase {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async execute(params: {
    tipo?: HistoryType;
    categoria?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<ExcelJS.Buffer> {
    const { history } = await this.historyRepository.findAll({
      page: 1,
      limit: 10000,
      ...params,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Tipo', key: 'tipo', width: 15 },
      { header: 'Produto', key: 'produto', width: 30 },
      { header: 'Categoria', key: 'categoria', width: 20 },
      { header: 'Quantidade', key: 'quantidade', width: 15 },
      { header: 'Usuário', key: 'usuario', width: 25 },
      { header: 'Data', key: 'data', width: 20 },
      { header: 'Observação', key: 'observacao', width: 40 },
    ];

    history.forEach((h) => {
      worksheet.addRow({
        id: h.id,
        tipo: h.tipo,
        produto: h.produto,
        categoria: h.categoria,
        quantidade: h.quantidade,
        usuario: h.usuario,
        data: h.data,
        observacao: h.observacao || '',
      });
    });

    return workbook.xlsx.writeBuffer();
  }
}

