import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PDFHeaderConfig {
  logo?: string; 
  logoWidth?: number;
  logoHeight?: number;
  title: string;
  subtitle?: string;
  showDate?: boolean;
  customDate?: string;
}

export interface PDFCompanyInfo {
  nit?: string;
  direccion?: string;
  celular?: string;
  email?: string;
}

export interface PDFMainInfo {
  label: string;
  value: string | number;
}

export interface PDFTableColumn {
  header: string;
  dataKey: string;
  width?: number;
}

export interface PDFTableData {
  [key: string]: string | number;
}

export interface PDFFooterConfig {
  showPageNumber?: boolean;
  customText?: string;
  showGeneratedBy?: boolean;
  generatedByText?: string;
}

export interface PDFConfig {
  header: PDFHeaderConfig;
  companyInfo?: PDFCompanyInfo;
  mainInfo?: PDFMainInfo[];
  
  table?: {
    columns: PDFTableColumn[];
    data: PDFTableData[];
    showTotal?: boolean;
    totalLabel?: string;
    totalValue?: string | number;
  };
  
  footer?: PDFFooterConfig;
  
  fileName?: string;
}

class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private currentY: number = 20;
  private lineHeight: number = 5; 
  
  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }
  
  private wrapText(text: string, maxWidth: number): string[] {
    if (this.doc.getTextWidth(text) <= maxWidth) {
      return [text];
    }

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (this.doc.getTextWidth(testLine) <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
          currentLine = '';
        }
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  // Agregar logo y título
  private addHeader(config: PDFHeaderConfig): void {
    const centerX = this.pageWidth / 2;
    
    // Logo
    if (config.logo) {
      const logoWidth = config.logoWidth || 40;
      const logoHeight = config.logoHeight || 20;
      const logoX = centerX - (logoWidth / 2);
      
      this.doc.addImage(config.logo, 'PNG', logoX, this.currentY, logoWidth, logoHeight);
      this.currentY += logoHeight + 5;
    }
    
    // Título principal
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(config.title, centerX, this.currentY, { align: 'center' });
    this.currentY += 8;
    
    // Subtítulo
    if (config.subtitle) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(config.subtitle, centerX, this.currentY, { align: 'center' });
      this.currentY += 6;
    }
    
    this.currentY += 5;
  }
  
  // Agregar información de la empresa
  private addCompanyInfo(info: PDFCompanyInfo): void {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const centerX = this.pageWidth / 2;
    
    if (info.nit) {
      this.doc.text(`Nit: ${info.nit}`, centerX, this.currentY, { align: 'center' });
      this.currentY += 5;
    }
    
    if (info.direccion) {
      this.doc.text(`Dirección: ${info.direccion}`, centerX, this.currentY, { align: 'center' });
      this.currentY += 5;
    }
    
    if (info.celular) {
      this.doc.text(`Celular: ${info.celular}`, centerX, this.currentY, { align: 'center' });
      this.currentY += 5;
    }
    
    if (info.email) {
      this.doc.text(`Email: ${info.email}`, centerX, this.currentY, { align: 'center' });
      this.currentY += 5;
    }
    
    this.currentY += 5;
  }
  

  private addMainInfo(infoList: PDFMainInfo[]): void {
    this.doc.setFontSize(10);
    const availableWidth = this.pageWidth - (2 * this.margin); 
    const spaceAfterLabel = 2; 

    infoList.forEach((info) => {
      const labelText = `${info.label}: `;
      const labelWidth = this.doc.getTextWidth(labelText);
      const valueMaxWidth = availableWidth - labelWidth - spaceAfterLabel;

      this.doc.setFont('helvetica', 'bold');
      this.doc.text(labelText, this.margin, this.currentY);

      this.doc.setFont('helvetica', 'normal');
      const valueText = String(info.value);
      const wrappedLines = this.wrapText(valueText, valueMaxWidth);

      let valueX = this.margin + labelWidth + spaceAfterLabel;
      this.doc.text(wrappedLines[0], valueX, this.currentY);

      for (let i = 1; i < wrappedLines.length; i++) {
        this.currentY += this.lineHeight;
        if (this.currentY > this.pageHeight - 30) { 
          this.doc.addPage();
          this.currentY = this.margin;
        }
        this.doc.text(wrappedLines[i], this.margin + labelWidth, this.currentY);
      }

      this.currentY += this.lineHeight + (wrappedLines.length - 1) * this.lineHeight;
    });

    this.currentY += 6; 
  }
  
  private addTable(config: PDFConfig['table']): void {
    if (!config) return;
    
    const tableConfig: any = {
      startY: this.currentY,
      head: [config.columns.map(col => col.header)],
      body: config.data.map(row => 
        config.columns.map(col => row[col.dataKey] || '')
      ),
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: 50
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: this.margin, right: this.margin }
    };
    
    if (config.columns.some(col => col.width)) {
      tableConfig.columnStyles = {};
      config.columns.forEach((col, index) => {
        if (col.width) {
          tableConfig.columnStyles[index] = { cellWidth: col.width };
        }
      });
    }
    
    autoTable(this.doc, tableConfig);
    
    const finalY = (this.doc as any).lastAutoTable?.finalY || this.currentY;
    this.currentY = finalY + 10;
    
    if (config.showTotal) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      
      const totalLabel = config.totalLabel || 'Total';
      const totalValue = config.totalValue || '0';
      
      this.doc.text(`${totalLabel}`, this.margin, this.currentY);
      this.doc.text(String(totalValue), this.pageWidth - this.margin, this.currentY, { align: 'right' });
      
      this.currentY += 10;
    }
  }
  
  private addFooter(config?: PDFFooterConfig): void {
    const footerY = this.pageHeight - 15;
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'italic');
    
    if (config?.showGeneratedBy !== false) {
      const generatedText = config?.generatedByText || 'Hechom por Ladrillera la transversal';
      this.doc.text(generatedText, this.pageWidth / 2, footerY, { align: 'center' });
    }
    
    if (config?.customText) {
      this.doc.text(config.customText, this.pageWidth / 2, footerY + 4, { align: 'center' });
    }
    
    if (config?.showPageNumber !== false) {
      const pageText = `página 1 de 1`;
      this.doc.text(pageText, this.pageWidth - this.margin, footerY, { align: 'right' });
    }
  }
  
  public generate(config: PDFConfig): void {
    this.addHeader(config.header);
    
    if (config.companyInfo) {
      this.addCompanyInfo(config.companyInfo);
    }

    if (config.mainInfo && config.mainInfo.length > 0) {
      this.addMainInfo(config.mainInfo);
    }
    

    if (config.table) {
      this.addTable(config.table);
    }
    
    this.addFooter(config.footer);
    
    const fileName = config.fileName || 'documento.pdf';
    this.doc.save(fileName);
  }
}

export const generatePDF = (config: PDFConfig): void => {
  const generator = new PDFGenerator();
  generator.generate(config);
};

export const usePDFGenerator = () => {
  const generate = (config: PDFConfig) => {
    generatePDF(config);
  };
  
  return { generate };
};

export default PDFGenerator;