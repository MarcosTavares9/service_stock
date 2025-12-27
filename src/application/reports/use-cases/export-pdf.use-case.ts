import { Injectable, Inject } from '@nestjs/common';
import { IHistoryRepository } from '@domain/history/ports/history.repository.port';
import * as PDFDocument from 'pdfkit';
import { HistoryType } from '@domain/history/entities/history.entity';

@Injectable()
export class ExportPdfUseCase {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async execute(params: {
    tipo?: HistoryType;
    categoria?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<Buffer> {
    const { history } = await this.historyRepository.findAll({
      page: 1,
      limit: 10000,
      ...params,
    });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('Relatório de Histórico', { align: 'center' });
      doc.moveDown();

      history.forEach((h) => {
        doc.fontSize(12).text(`ID: ${h.id}`);
        doc.text(`Tipo: ${h.tipo}`);
        doc.text(`Produto: ${h.produto}`);
        doc.text(`Categoria: ${h.categoria}`);
        doc.text(`Quantidade: ${h.quantidade}`);
        doc.text(`Usuário: ${h.usuario}`);
        doc.text(`Data: ${h.data.toISOString()}`);
        if (h.observacao) {
          doc.text(`Observação: ${h.observacao}`);
        }
        doc.moveDown();
      });

      doc.end();
    });
  }
}

