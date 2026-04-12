import { Injectable, Inject } from '@nestjs/common';
import { IHistoryRepository } from '../history/history.repository';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';

interface ReportParams {
  type?: string;
  product_id?: string;
  dataInicio?: string;
  dataFim?: string;
  user_id?: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async exportCsv(params: ReportParams): Promise<Buffer> {
    const { history } = await this.historyRepository.findAll({
      page: 1,
      limit: 10000,
      ...params,
    });

    const escapeCsvCell = (value: unknown): string => {
      const str = String(value ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = [
      'UUID', 'Tipo', 'ID Produto', 'ID Usuário',
      'Quantidade Alterada', 'Quantidade Anterior', 'Quantidade Nova',
      'Data', 'Observação',
    ];

    const rows = history.map((h) => [
      h.uuid,
      h.type,
      h.product_id ?? '',
      h.user_id ?? '',
      h.quantity_changed,
      h.previous_quantity ?? '',
      h.new_quantity ?? '',
      h.created_at.toISOString(),
      h.observation ?? '',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvCell).join(','))
      .join('\r\n');

    // BOM prefix ensures Excel opens UTF-8 correctly
    return Buffer.from('\uFEFF' + csv, 'utf8');
  }

  async exportExcel(params: ReportParams): Promise<ExcelJS.Buffer> {
    const { history } = await this.historyRepository.findAll({
      page: 1,
      limit: 10000,
      ...params,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');

    worksheet.columns = [
      { header: 'UUID', key: 'uuid', width: 36 },
      { header: 'Tipo', key: 'type', width: 15 },
      { header: 'ID Produto', key: 'product_id', width: 36 },
      { header: 'ID Usuário', key: 'user_id', width: 36 },
      { header: 'Quantidade Alterada', key: 'quantity_changed', width: 20 },
      { header: 'Quantidade Anterior', key: 'previous_quantity', width: 20 },
      { header: 'Quantidade Nova', key: 'new_quantity', width: 20 },
      { header: 'Data', key: 'created_at', width: 20 },
      { header: 'Observação', key: 'observation', width: 40 },
    ];

    history.forEach((h) => {
      worksheet.addRow({
        uuid: h.uuid,
        type: h.type,
        product_id: h.product_id || '',
        user_id: h.user_id || '',
        quantity_changed: h.quantity_changed,
        previous_quantity: h.previous_quantity || '',
        new_quantity: h.new_quantity || '',
        created_at: h.created_at,
        observation: h.observation || '',
      });
    });

    return workbook.xlsx.writeBuffer();
  }

  async exportPdf(params: ReportParams): Promise<Buffer> {
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
        doc.fontSize(12).text(`UUID: ${h.uuid}`);
        doc.text(`Tipo: ${h.type}`);
        doc.text(`ID Produto: ${h.product_id || 'N/A'}`);
        doc.text(`ID Usuário: ${h.user_id || 'N/A'}`);
        doc.text(`Quantidade Alterada: ${h.quantity_changed}`);
        if (h.previous_quantity !== null) {
          doc.text(`Quantidade Anterior: ${h.previous_quantity}`);
        }
        if (h.new_quantity !== null) {
          doc.text(`Quantidade Nova: ${h.new_quantity}`);
        }
        doc.text(`Data: ${h.created_at.toISOString()}`);
        if (h.observation) {
          doc.text(`Observação: ${h.observation}`);
        }
        doc.moveDown();
      });

      doc.end();
    });
  }
}
