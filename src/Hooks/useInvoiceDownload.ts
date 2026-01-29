import React, { useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';

export interface PDFInvoiceCompanyInfo {
  name?: string;
  logo?: string | null;
  logoWidth?: number;
  logoHeight?: number;
  title?: string;
  nit?: string;
  direccion?: string;
  celular?: string;
  email?: string;
}

export interface PDFInvoiceMainInfo {
  fecha: string;
  invoiceNumber: string;
  cashier?: string;
  clientIdentification?: string;
  cliente?: string;
}

export interface PDFInvoiceProduct {
  nombre: string;
  cantidad: number;
  precio: number;
  total: number;
}

export interface PDFInvoiceSummary {
  valorBruto: number;
  descuentoTotal: number;
  costoTransporte?: number;
  servicioVoluntario?: number;
  ibua?: number;
  total: number;
}

export interface PDFInvoicePayment {
  metodoPago: string;
  efectivoRecibido?: number;
  cambio?: number;
  tipoPago: string;
  abono?: number;
  restante?: number;
  fechaVencimiento?: string;
}

export interface PDFInvoiceFooter {
  showGeneratedBy?: boolean;
  generatedByText?: string;
  showPageNumber?: boolean;
}

export interface PDFInvoiceConfig {
  companyInfo: PDFInvoiceCompanyInfo;
  mainInfo: PDFInvoiceMainInfo;
  products: PDFInvoiceProduct[];
  summary: PDFInvoiceSummary;
  payment: PDFInvoicePayment;
  entrega: string;
  observacion?: string;
  footer?: PDFInvoiceFooter;
  fileName?: string;
}

class PDFInvoiceGenerator {
  private doc: jsPDF;
  private pageWidth: number = 58;
  private margin: number = 2;
  private currentY: number = 2;
  private centerX: number;
  private labelWidth: number = 11;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [this.pageWidth, 297],
      compress: true,
      precision: 16,
      putOnlyUsedFonts: true
    });
    this.centerX = this.pageWidth / 2;
  }

  private async convertToGrayscale(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 3; // ⬅️ REDUCIDO de 10 a 3 para más velocidad
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = data[i + 1] = data[i + 2] = gray;
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png', 0.8)); // ⬅️ Calidad de 1.0 a 0.8
      };
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = imageUrl;
    });
  }

  private async addLogo(config: PDFInvoiceCompanyInfo): Promise<void> {
    if (config.logo) {
      try {
        const logoWidth = config.logoWidth || 20;
        const logoHeight = config.logoHeight || 20;
        const logoX = this.centerX - logoWidth / 2;
        const grayscaleLogo = await this.convertToGrayscale(config.logo);
        this.doc.addImage(grayscaleLogo, 'PNG', logoX, this.currentY, logoWidth, logoHeight);
        this.currentY += logoHeight + 1;

        if (config.title) {
          this.doc.setFontSize(7);
          this.doc.setFont('helvetica', 'bold');
          const lines = config.title.split(' ');
          const midpoint = Math.ceil(lines.length / 2);
          const line1 = lines.slice(0, midpoint).join(' ').toUpperCase();
          const line2 = lines.slice(midpoint).join(' ').toUpperCase();
          this.doc.text(line1, this.centerX, this.currentY, { align: 'center' });
          this.currentY += 3.5;
          this.doc.text(line2, this.centerX, this.currentY, { align: 'center' });
          this.currentY += 4;
        }
      } catch (error) {
        console.error('Error al procesar el logo:', error);
        this.doc.setFontSize(14);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('TU LOGO', this.centerX, this.currentY, { align: 'center' });
        this.currentY += 6;
      }
    } else {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('TU LOGO', this.centerX, this.currentY, { align: 'center' });
      this.currentY += 6;
    }
  }

  private addMainInfo(info: PDFInvoiceMainInfo): void {
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'normal');

    this.doc.setFont('helvetica', 'bold');
    const ventaLabel = 'Venta:';
    const ventaLabelWidth = this.doc.getTextWidth(ventaLabel);
    const ventaNumberWidth = this.doc.getTextWidth(info.invoiceNumber);
    const numberX = this.pageWidth - this.margin;
    const labelX = numberX - ventaNumberWidth - 1;

    this.doc.text(ventaLabel, labelX - ventaLabelWidth, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(info.invoiceNumber, numberX, this.currentY, { align: 'right' });
    this.currentY += 4;

    this.addLabeledText('Fecha:', info.fecha);

    if (info.cashier) {
      this.addLabeledText('Cajero:', info.cashier);
    }

    if (info.clientIdentification) {
      this.addLabeledText('C.C / NIT:', info.clientIdentification);
    }

    if (info.cliente) {
      this.addLabeledText('Cliente:', info.cliente, true);
    }

    this.currentY += 0.5;
  }

  private addLabeledText(label: string, value: string, wrap: boolean = false) {
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(label, this.margin, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    const valueX = this.margin + this.labelWidth;
    const availableWidth = this.pageWidth - valueX - this.margin;
    if (wrap) {
      const lines = this.doc.splitTextToSize(value, availableWidth);
      lines.forEach((line: string, idx: number) => {
        this.doc.text(line, valueX, this.currentY + (idx * 3.5));
      });
      this.currentY += lines.length * 3.5;
    } else {
      let fontSize = 7;
      this.doc.setFontSize(fontSize);
      let textWidth = this.doc.getTextWidth(value);
      while (textWidth > availableWidth && fontSize > 5) {
        fontSize -= 0.2;
        this.doc.setFontSize(fontSize);
        textWidth = this.doc.getTextWidth(value);
      }
      let textoFinal = value;
      if (textWidth > availableWidth) {
        while (this.doc.getTextWidth(textoFinal + '...') > availableWidth && textoFinal.length > 0) {
          textoFinal = textoFinal.slice(0, -1);
        }
        textoFinal += '...';
      }
      this.doc.text(textoFinal, valueX, this.currentY);
      this.doc.setFontSize(7);
      this.currentY += 3.5;
    }
  }

  private addEntrega(entrega: string): void {
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Domicilio:', this.margin, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(entrega, this.margin + this.labelWidth, this.currentY);
    this.currentY += 4;
    this.addSeparatorLine();
  }

  private addSeparatorLine(dashed: boolean = false): void {
    this.doc.setLineWidth(0.1);
    if (dashed) {
      this.doc.setLineDashPattern([1, 1], 0);
    }
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.doc.setLineDashPattern([], 0);
    this.currentY += 2;
  }

  private addSeparatorLinePos(): void {
    this.doc.setLineWidth(0.1);
    this.doc.setLineDashPattern([1, 0.5], 0);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.doc.setLineDashPattern([], 0);
    this.currentY += 2;
  }

  private addProductsTable(products: PDFInvoiceProduct[]): void {
    const hasQuantity = products.some(p => p.cantidad !== undefined);

    const cantX = this.pageWidth - 35;
    const vUnitX = this.pageWidth - 22;
    const totalX = this.pageWidth - this.margin;

    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'bold');

    if (hasQuantity) {
      this.doc.text('Producto', this.margin, this.currentY);
      this.doc.text('Cant', cantX, this.currentY, { align: 'right' });
      this.doc.text('V.Unit', vUnitX, this.currentY, { align: 'right' });
      this.doc.text('Total', totalX, this.currentY, { align: 'right' });
    } else {
      this.doc.text('Producto', this.margin, this.currentY);
      this.doc.text('Valor', totalX, this.currentY, { align: 'right' });
    }

    this.currentY += 4;
    this.addSeparatorLine();

    this.doc.setFont('helvetica', 'normal');

    products.forEach((product) => {
      const maxWidth = hasQuantity ? 15 : 36;

      let fontSize = 6.5;
      this.doc.setFontSize(fontSize);
      let textWidth = this.doc.getTextWidth(product.nombre);

      while (textWidth > maxWidth && fontSize > 5) {
        fontSize -= 0.3;
        this.doc.setFontSize(fontSize);
        textWidth = this.doc.getTextWidth(product.nombre);
      }

      if (textWidth > maxWidth) {
        const lines = this.doc.splitTextToSize(product.nombre, maxWidth);
        lines.forEach((line: string, index: number) => {
          this.doc.text(line, this.margin, this.currentY);

          if (index === lines.length - 1) {
            if (hasQuantity && product.cantidad) {
              this.doc.setFontSize(7);
              this.doc.text(product.cantidad.toString(), cantX, this.currentY, { align: 'right' });
            }
            this.doc.setFontSize(7);
            const valorFormateado = `$${product.precio.toLocaleString('es-CO')}`;
            this.doc.text(valorFormateado, vUnitX, this.currentY, { align: 'right' });
            const valorFormateadoTotal = `$${product.total.toLocaleString('es-CO')}`;
            this.doc.text(valorFormateadoTotal, totalX, this.currentY, { align: 'right' });
          }

          this.currentY += 4;
        });
      } else {
        this.doc.text(product.nombre, this.margin, this.currentY);

        if (hasQuantity && product.cantidad) {
          this.doc.setFontSize(7);
          this.doc.text(product.cantidad.toString(), cantX, this.currentY, { align: 'right' });
        }
        this.doc.setFontSize(7);
        const valorFormateado = `$${product.precio.toLocaleString('es-CO')}`;
        this.doc.text(valorFormateado, vUnitX, this.currentY, { align: 'right' });
        const valorFormateadoTotal = `$${product.total.toLocaleString('es-CO')}`;
        this.doc.text(valorFormateadoTotal, totalX, this.currentY, { align: 'right' });

        this.currentY += 4;
      }

      this.doc.setFontSize(7);
      this.currentY += 0.5;
    });

    this.addSeparatorLinePos();
  }

  private addSummary(summary: PDFInvoiceSummary): void {
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'normal');

    this.doc.text('Valor Bruto:', this.margin, this.currentY);
    this.doc.text(`$${summary.valorBruto.toLocaleString('es-CO')}`, this.pageWidth - this.margin, this.currentY, { align: 'right' });
    this.currentY += 4;

    if (summary.servicioVoluntario !== undefined) {
      this.doc.text('Servicio voluntario:', this.margin, this.currentY);
      this.doc.text(`$${summary.servicioVoluntario.toLocaleString('es-CO')}`, this.pageWidth - this.margin, this.currentY, { align: 'right' });
      this.currentY += 4;
    }

    if (summary.costoTransporte !== undefined) {
      this.doc.text('Transporte:', this.margin, this.currentY);
      this.doc.text(`$${summary.costoTransporte.toLocaleString('es-CO')}`, this.pageWidth - this.margin, this.currentY, { align: 'right' });
      this.currentY += 4;
    }

    this.doc.text('Descuento:', this.margin, this.currentY);
    this.doc.text(`$${summary.descuentoTotal.toLocaleString('es-CO')}`, this.pageWidth - this.margin, this.currentY, { align: 'right' });
    this.currentY += 4;

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Total a pagar:', this.margin, this.currentY);
    this.doc.text(`$${summary.total.toLocaleString('es-CO')}`, this.pageWidth - this.margin, this.currentY, { align: 'right' });
    this.doc.setFont('helvetica', 'normal');
    this.currentY += 4;
    this.addSeparatorLinePos();
  }

  private addPaymentInfo(payment: PDFInvoicePayment, total: number): void {
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Forma de pago', this.centerX, this.currentY, { align: 'center' });
    this.currentY += 4;
    this.doc.setFont('helvetica', 'normal');

    const amount = payment.tipoPago === 'abono' ? (payment.abono || 0) : total;
    this.doc.text(`${payment.metodoPago}:`, this.margin, this.currentY);
    this.doc.text(`$${amount.toLocaleString('es-CO')}`, this.pageWidth - this.margin, this.currentY, { align: 'right' });
    this.currentY += 4;

    if (payment.cambio !== undefined) {
      this.doc.text('Cambio:', this.margin, this.currentY);
      this.doc.text(`$${payment.cambio.toLocaleString('es-CO')}`, this.pageWidth - this.margin, this.currentY, { align: 'right' });
      this.currentY += 4;
    }

    if (payment.tipoPago === 'abono' && payment.abono !== undefined && payment.restante !== undefined) {
      this.doc.text('Abono:', this.margin, this.currentY);
      this.doc.text(`$${payment.abono.toLocaleString('es-CO')}`, this.pageWidth - this.margin, this.currentY, { align: 'right' });
      this.currentY += 4;
      this.doc.text('Resta:', this.margin, this.currentY);
      this.doc.text(`$${payment.restante.toLocaleString('es-CO')}`, this.pageWidth - this.margin, this.currentY, { align: 'right' });
      this.currentY += 4;
    }

    if (payment.tipoPago === 'credito' && payment.fechaVencimiento) {
      this.doc.text('Fecha vencimiento:', this.margin, this.currentY);
      this.doc.text(payment.fechaVencimiento, this.pageWidth - this.margin, this.currentY, { align: 'right' });
      this.currentY += 4;
    }

    this.addSeparatorLine();
  }

  private addObservacion(observacion?: string): void {
    if (observacion) {
      this.doc.setFontSize(7);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Observación:', this.margin, this.currentY);
      this.currentY += 4;
      this.doc.setFont('helvetica', 'normal');
      const lines = this.doc.splitTextToSize(observacion, this.pageWidth - this.margin * 2);
      lines.forEach((line: string) => {
        this.doc.text(line, this.margin, this.currentY);
        this.currentY += 4;
      });
      this.addSeparatorLine();
    }
  }

  private addFooter(config?: PDFInvoiceFooter): void {
    this.doc.setFontSize(6);
    this.doc.setFont('helvetica', 'italic');

    if (config?.showGeneratedBy !== false) {
      const generatedText = config?.generatedByText || 'Hecho en Colombia con <3 por Halltec';
      const lines = this.doc.splitTextToSize(generatedText, this.pageWidth - this.margin * 2);
      lines.forEach((line: string) => {
        this.doc.text(line, this.centerX, this.currentY, { align: 'center' });
        this.currentY += 3.5;
      });
    }

    if (config?.showPageNumber !== false) {
      this.doc.text('página 1 de 1', this.centerX, this.currentY, { align: 'center' });
      this.currentY += 3;
    }

    this.currentY += 2;
  }

  private addCompanyInfo(info: PDFInvoiceCompanyInfo): void {
    if (info.name) {
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(info.name.toUpperCase(), this.centerX, this.currentY, { align: 'center' });
      this.currentY += 3.5;
    }
    this.doc.setFontSize(6);
    this.doc.setFont('helvetica', 'normal');
    if (info.nit) {
      this.doc.text(`Nit: ${info.nit}`, this.centerX, this.currentY, { align: 'center' });
      this.currentY += 3.5;
    }
    if (info.direccion) {
      const lines = this.doc.splitTextToSize(`Direccion: ${info.direccion}`, this.pageWidth - this.margin * 2);
      lines.forEach((line: string) => {
        this.doc.text(line, this.centerX, this.currentY, { align: 'center' });
        this.currentY += 3.5;
      });
    }
    if (info.celular) {
      this.doc.text(`Celular: ${info.celular}`, this.centerX, this.currentY, { align: 'center' });
      this.currentY += 3.5;
    }
    if (info.email) {
      const lines = this.doc.splitTextToSize(`Email: ${info.email}`, this.pageWidth - this.margin * 2);
      lines.forEach((line: string) => {
        this.doc.text(line, this.centerX, this.currentY, { align: 'center' });
        this.currentY += 3.5;
      });
    }
    this.currentY += 1;
  }

  // ✅ OPTIMIZADO: Solo UNA generación
  public async generate(config: PDFInvoiceConfig): Promise<void> {
    // Generar contenido una sola vez
    await this.addLogo(config.companyInfo);
    this.addCompanyInfo(config.companyInfo);
    this.addSeparatorLine();
    this.addMainInfo(config.mainInfo);
    this.addEntrega(config.entrega);
    this.addProductsTable(config.products);
    this.addSummary(config.summary);
    this.addPaymentInfo(config.payment, config.summary.total);
    this.addObservacion(config.observacion);
    this.addFooter(config.footer);

    // Descargar directamente
    const fileName = config.fileName || `Factura_${config.mainInfo.invoiceNumber}.pdf`;
    this.doc.save(fileName);
  }
}

export const generateInvoicePDF = async (config: PDFInvoiceConfig): Promise<void> => {
  const generator = new PDFInvoiceGenerator();
  await generator.generate(config);
};

// ✅ EJECUTA INMEDIATAMENTE al montar
const InvoicePDF: React.FC<{ config: PDFInvoiceConfig }> = ({ config }) => {
  useEffect(() => {
    // ✅ Ejecutar inmediatamente sin verificaciones
    generateInvoicePDF(config);
  }, [config]); // ✅ Ejecutar cuando cambie config

  return null;
};

export default InvoicePDF;