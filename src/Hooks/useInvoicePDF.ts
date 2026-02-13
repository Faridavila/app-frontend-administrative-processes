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
  direccion?: string;
  barrio?: string;
  celular?: string;
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
        const scale = 4;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext('2d', {
          alpha: false,
          willReadFrequently: true
        });
        
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = gray;
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png', 0.8));
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

    this.addLabeledText('Fecha', info.fecha);

    if (info.cashier) {
      this.addLabeledText('Cajero', info.cashier);
    }

    if (info.clientIdentification) {
      this.addLabeledText('C.C / NIT', info.clientIdentification);
    }

    if (info.cliente) {
      this.addLabeledText('Cliente', info.cliente, true);
    }

      if (info.celular) {
      this.addLabeledText('Celular', info.celular, true);
    }

    if (info.barrio) {
      this.addLabeledText('Barrio', info.barrio, true);
    }
    if (info.direccion) {
      this.addLabeledText('Dirección', info.direccion, true);
    }
  

    this.currentY += 0.5;
  }

  private addLabeledText(label: string, value: string, wrap: boolean = false) {
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'bold');
    
    const cleanLabel = label.endsWith(':') ? label.slice(0, -1) : label;
    this.doc.text(cleanLabel, this.margin, this.currentY);
    
    const colonX = this.margin + this.labelWidth;
    this.doc.text(':', colonX, this.currentY);
    
    this.doc.setFont('helvetica', 'normal');
    const valueX = colonX + 2;
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
    
    this.doc.text('Domicilio', this.margin, this.currentY);
    
    const colonX = this.margin + this.labelWidth;
    this.doc.text(':', colonX, this.currentY);
    
    this.doc.setFont('helvetica', 'normal');
    const valueX = colonX + 2;
    
    const availableWidth = this.pageWidth - valueX - this.margin;
    const lines = this.doc.splitTextToSize(entrega, availableWidth);
    
    lines.forEach((line: string, idx: number) => {
      this.doc.text(line, valueX, this.currentY + (idx * 3.5));
    });
    
    this.currentY += lines.length * 3.5 + 0.5;
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
      this.doc.setFontSize(8);
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

  private calculateEstimatedHeight(config: PDFInvoiceConfig): number {
    let height = 70;
    height += config.products.length * 12;
    height += config.observacion ? 20 : 0;
    height += config.payment.tipoPago === 'abono' ? 12 : 0;
    height += config.payment.tipoPago === 'credito' ? 8 : 0;
    height += config.summary.costoTransporte ? 8 : 0;
    // ✅ CAMBIO 1: Aumentar margen de seguridad y altura mínima
    height = Math.ceil(height * 1.4); // Margen de seguridad del 40%
    return Math.max(240, Math.min(height, 297)); // Mínimo 240mm
  }

  public async generate(config: PDFInvoiceConfig): Promise<string> {
    // ✅ CAMBIO 2: Limpiar iframes anteriores
    const existingFrames = document.querySelectorAll('iframe[data-pdf-invoice]');
    existingFrames.forEach(frame => frame.parentNode?.removeChild(frame));
    await new Promise(resolve => setTimeout(resolve, 200));

    const estimatedHeight = this.calculateEstimatedHeight(config);
    
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [this.pageWidth, estimatedHeight],
      compress: true,
      precision: 16,
      putOnlyUsedFonts: true
    });
    this.currentY = 2;

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

    // ✅ CAMBIO 3: Esperar antes de generar blob
    await new Promise(resolve => setTimeout(resolve, 200));

    const pdfBlob = this.doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // ✅ CAMBIO 4: Agregar identificador al iframe
    const printFrame = document.createElement('iframe');
    printFrame.setAttribute('data-pdf-invoice', 'true');
    printFrame.style.cssText = 'position:fixed;width:0;height:0;border:0;visibility:hidden';
    printFrame.src = pdfUrl;
    
    document.body.appendChild(printFrame);

    return new Promise((resolve) => {
      printFrame.onload = () => {
        // ✅ CAMBIO 5: Aumentar tiempo de espera
        setTimeout(() => {
          if (printFrame.contentWindow) {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
          }
          
          const checkPrintDialog = () => {
            // ✅ CAMBIO 6: Aumentar tiempo de limpieza
            setTimeout(() => {
              if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
              }
              URL.revokeObjectURL(pdfUrl);
              resolve(pdfUrl);
            }, 3000); // 3 segundos
          };

          setTimeout(checkPrintDialog, 500);
        }, 800); // 800ms para cargar
      };
    });
  }
}

export const generateInvoicePDF = async (config: PDFInvoiceConfig): Promise<string> => {
  // ✅ CAMBIO 7: Crear nueva instancia cada vez
  const generator = new PDFInvoiceGenerator();
  return await generator.generate(config);
};

const InvoicePDF: React.FC<{ config: PDFInvoiceConfig }> = ({ config }) => {
  const hasGenerated = useRef(false);
  const lastInvoiceNumber = useRef<string>("");

  useEffect(() => {
    if (lastInvoiceNumber.current === config.mainInfo.invoiceNumber) {
      return;
    }

    lastInvoiceNumber.current = config.mainInfo.invoiceNumber;

    const generate = async () => {
      await generateInvoicePDF(config);
    };
    generate();
  }, [config.mainInfo.invoiceNumber]);

  return null;
};

export default InvoicePDF;