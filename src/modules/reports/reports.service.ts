import { Injectable, Inject } from '@nestjs/common';
import { IHistoryRepository } from '../history/history.repository';
import { createObjectCsvWriter } from 'csv-writer';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';

interface ReportParams {
  type?: string;
  product_id?: string;
  dataInicio?: string;
  dataFim?: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async exportCsv(params: ReportParams): Promise<string> {
    const { history } = await this.historyRepository.findAll({
      page: 1,
      limit: 10000,
      ...params,
    });

    const csvWriter = createObjectCsvWriter({
      path: 'temp-report.csv',
      header: [
        { id: 'uuid', title: 'UUID' },
        { id: 'type', title: 'Tipo' },
        { id: 'product_id', title: 'ID Produto' },
        { id: 'user_id', title: 'ID Usuário' },
        { id: 'quantity_changed', title: 'Quantidade Alterada' },
        { id: 'previous_quantity', title: 'Quantidade Anterior' },
        { id: 'new_quantity', title: 'Quantidade Nova' },
        { id: 'created_at', title: 'Data' },
        { id: 'observation', title: 'Observação' },
      ],
    });

    await csvWriter.writeRecords(
      history.map((h) => ({
        uuid: h.uuid,
        type: h.type,
        product_id: h.product_id || '',
        user_id: h.user_id || '',
        quantity_changed: h.quantity_changed,
        previous_quantity: h.previous_quantity || '',
        new_quantity: h.new_quantity || '',
        created_at: h.created_at.toISOString(),
        observation: h.observation || '',
      })),
    );

    return 'temp-report.csv';
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
