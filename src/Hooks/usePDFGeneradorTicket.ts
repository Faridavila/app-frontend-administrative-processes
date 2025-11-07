import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Interfaces para la configuración del PDF Ticket
export interface PDFTicketCompanyInfo {
  logo?: string; // URL o base64 de la imagen
  logoWidth?: number;
  logoHeight?: number;
  nit?: string;
  direccion?: string;
  celular?: string;
  email?: string;
}

export interface PDFTicketMainInfo {
  fecha: string;
  numeroPago?: string;
  proveedor?: string;
  cliente?: string;
}

export interface PDFTicketProduct {
  producto: string;
  cantidad?: number;
  valor: number;
}

export interface PDFTicketFooter {
  showGeneratedBy?: boolean;
  generatedByText?: string;
  showPageNumber?: boolean;
}

export interface PDFTicketConfig {
  // Información de la empresa
  companyInfo: PDFTicketCompanyInfo;
  
  // Información principal (Fecha, N° Pago, Proveedor/Cliente)
  mainInfo: PDFTicketMainInfo;
  
  // Productos
  products: PDFTicketProduct[];
  
  // Total
  total: number;
  
  // Configuración del pie de página
  footer?: PDFTicketFooter;
  
  // Nombre del archivo
  fileName?: string;
  
  // Tipo de ticket (compra o venta)
  ticketType?: 'compra' | 'venta';
}

class PDFTicketGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private margin: number = 8; // Márgenes más pequeños
  private currentY: number = 8;
  private centerX: number;
  private contentHeight: number = 0;
  
  constructor() {
    // Tamaño inicial temporal - se ajustará después
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [58, 297] // Ancho reducido de 80mm a 58mm
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.centerX = this.pageWidth / 2;
  }
  
  // Convertir imagen a escala de grises
  private async convertToGrayscale(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }
        
        // Dibujar la imagen original
        ctx.drawImage(img, 0, 0);
        
        // Obtener los datos de la imagen
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Convertir a escala de grises
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = gray;     // R
          data[i + 1] = gray; // G
          data[i + 2] = gray; // B
          // data[i + 3] es el canal alpha, lo dejamos igual
        }
        
        // Poner los datos modificados de vuelta
        ctx.putImageData(imageData, 0, 0);
        
        // Convertir a base64
        resolve(canvas.toDataURL('image/png'));
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };
      
      img.src = imageUrl;
    });
  }
  
  // Agregar logo
  private async addLogo(config: PDFTicketCompanyInfo): Promise<void> {
    if (config.logo) {
      try {
        const logoWidth = config.logoWidth || 20;
        const logoHeight = config.logoHeight || 20;
        const logoX = this.centerX - (logoWidth / 2);
        
        // Convertir el logo a escala de grises
        const grayscaleLogo = await this.convertToGrayscale(config.logo);
        
        this.doc.addImage(grayscaleLogo, 'PNG', logoX, this.currentY, logoWidth, logoHeight);
        this.currentY += logoHeight + 2;
      } catch (error) {
        console.error('Error al procesar el logo:', error);
        // Si hay error, mostrar texto alternativo
        this.doc.setFontSize(14);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('TU LOGO', this.centerX, this.currentY, { align: 'center' });
        this.currentY += 6;
      }
    } else {
      // Si no hay logo, agregar texto "TU LOGO"
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('TU LOGO', this.centerX, this.currentY, { align: 'center' });
      this.currentY += 6;
    }
  }
  
  // Agregar información de la empresa (centrado)
  private addCompanyInfo(info: PDFTicketCompanyInfo): void {
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'normal');
    
    if (info.nit) {
      this.doc.text(`Nit: ${info.nit}`, this.centerX, this.currentY, { align: 'center' });
      this.currentY += 3.5;
    }
    
    if (info.direccion) {
      // Dividir dirección si es muy larga
      const direccionLines = this.doc.splitTextToSize(`Dirección: ${info.direccion}`, this.pageWidth - (this.margin * 2));
      direccionLines.forEach((line: string) => {
        this.doc.text(line, this.centerX, this.currentY, { align: 'center' });
        this.currentY += 3.5;
      });
    }
    
    if (info.celular) {
      this.doc.text(`Celular: ${info.celular}`, this.centerX, this.currentY, { align: 'center' });
      this.currentY += 3.5;
    }
    
    if (info.email) {
      // Dividir email si es muy largo
      const emailLines = this.doc.splitTextToSize(`Email: ${info.email}`, this.pageWidth - (this.margin * 2));
      emailLines.forEach((line: string) => {
        this.doc.text(line, this.centerX, this.currentY, { align: 'center' });
        this.currentY += 3.5;
      });
    }
    
    this.currentY += 2;
  }
  
  // Agregar línea separadora
  private addSeparatorLine(): void {
    this.doc.setLineWidth(0.1);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 2.5;
  }
  
  // Agregar información principal (alineado a la izquierda)
  private addMainInfo(info: PDFTicketMainInfo): void {
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'normal');
    
    // Fecha
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Fecha:', this.margin, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    const fechaX = this.margin + 12;
    this.doc.text(info.fecha, fechaX, this.currentY);
    this.currentY += 3.5;
    
    // N° Pago
    if (info.numeroPago) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('N° Pago:', this.margin, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(info.numeroPago, this.margin + 15, this.currentY);
      this.currentY += 3.5;
    }
    
    // Proveedor o Cliente - Todo en una línea
    if (info.proveedor) {
      this.doc.setFontSize(7);
      this.doc.setFont('helvetica', 'bold');
      const labelProveedor = 'Proveedor:';
      this.doc.text(labelProveedor, this.margin, this.currentY);
      
      const labelWidth = this.doc.getTextWidth(labelProveedor);
      const proveedorX = this.margin + labelWidth + 1;
      const availableWidth = this.pageWidth - proveedorX - this.margin;
      
      this.doc.setFont('helvetica', 'normal');
      
      // Verificar si el texto cabe en el espacio disponible
      let fontSize = 7;
      this.doc.setFontSize(fontSize);
      let textWidth = this.doc.getTextWidth(info.proveedor);
      
      // Reducir tamaño de fuente si es necesario para que quepa en una línea
      while (textWidth > availableWidth && fontSize > 4.5) {
        fontSize -= 0.3;
        this.doc.setFontSize(fontSize);
        textWidth = this.doc.getTextWidth(info.proveedor);
      }
      
      // Si aún no cabe, truncar el texto
      let textoFinal = info.proveedor;
      if (textWidth > availableWidth) {
        while (this.doc.getTextWidth(textoFinal + '...') > availableWidth && textoFinal.length > 0) {
          textoFinal = textoFinal.slice(0, -1);
        }
        textoFinal += '...';
      }
      
      this.doc.text(textoFinal, proveedorX, this.currentY, { maxWidth: availableWidth });
      this.doc.setFontSize(7); // Restaurar tamaño original
      this.currentY += 3.5;
    }
    
    if (info.cliente) {
      this.doc.setFontSize(7);
      this.doc.setFont('helvetica', 'bold');
      const labelCliente = 'Cliente:';
      this.doc.text(labelCliente, this.margin, this.currentY);
      
      const labelWidth = this.doc.getTextWidth(labelCliente);
      const clienteX = this.margin + labelWidth + 1;
      const availableWidth = this.pageWidth - clienteX - this.margin;
      
      this.doc.setFont('helvetica', 'normal');
      
      // Verificar si el texto cabe en el espacio disponible
      let fontSize = 7;
      this.doc.setFontSize(fontSize);
      let textWidth = this.doc.getTextWidth(info.cliente);
      
      // Reducir tamaño de fuente si es necesario para que quepa en una línea
      while (textWidth > availableWidth && fontSize > 4.5) {
        fontSize -= 0.3;
        this.doc.setFontSize(fontSize);
        textWidth = this.doc.getTextWidth(info.cliente);
      }
      
      // Si aún no cabe, truncar el texto
      let textoFinal = info.cliente;
      if (textWidth > availableWidth) {
        while (this.doc.getTextWidth(textoFinal + '...') > availableWidth && textoFinal.length > 0) {
          textoFinal = textoFinal.slice(0, -1);
        }
        textoFinal += '...';
      }
      
      this.doc.text(textoFinal, clienteX, this.currentY, { maxWidth: availableWidth });
      this.doc.setFontSize(7); // Restaurar tamaño original
      this.currentY += 3.5;
    }
    
    this.currentY += 1.5;
  }
  
  // Agregar tabla de productos
  private addProductsTable(products: PDFTicketProduct[]): void {
    this.addSeparatorLine();
    
    const hasQuantity = products.some(p => p.cantidad !== undefined);
    
    // Encabezados
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'bold');
    
    if (hasQuantity) {
      this.doc.text('Producto', this.margin, this.currentY);
      this.doc.text('Cant', this.pageWidth - 23, this.currentY, { align: 'right' });
      this.doc.text('Valor', this.pageWidth - this.margin, this.currentY, { align: 'right' });
    } else {
      this.doc.text('Producto', this.margin, this.currentY);
      this.doc.text('Valor', this.pageWidth - this.margin, this.currentY, { align: 'right' });
    }
    
    this.currentY += 3.5;
    this.addSeparatorLine();
    
    // Productos
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    
    products.forEach((product) => {
      // Dividir nombre largo en múltiples líneas si es necesario
      const maxWidth = hasQuantity ? 28 : 36;
      const lines = this.doc.splitTextToSize(product.producto, maxWidth);
      
      lines.forEach((line: string, index: number) => {
        this.doc.text(line, this.margin, this.currentY);
        
        if (index === lines.length - 1) {
          // Solo en la última línea mostrar cantidad y valor
          if (hasQuantity && product.cantidad) {
            this.doc.text(product.cantidad.toString(), this.pageWidth - 23, this.currentY, { align: 'right' });
          }
          const valorFormateado = `$${product.valor.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          this.doc.text(valorFormateado, this.pageWidth - this.margin, this.currentY, { align: 'right' });
        }
        
        this.currentY += 3.5;
      });
      
      this.currentY += 0.5;
    });
    
    this.addSeparatorLine();
  }
  
  // Agregar total
  private addTotal(total: number): void {
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    
    const totalFormateado = `$${total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    this.doc.text('Total', this.margin, this.currentY);
    this.doc.text(totalFormateado, this.pageWidth - this.margin, this.currentY, { align: 'right' });
    
    this.currentY += 4;
    this.addSeparatorLine();
  }
  
  // Agregar pie de página
  private addFooter(config?: PDFTicketFooter): void {
    this.doc.setFontSize(6.5);
    this.doc.setFont('helvetica', 'italic');
    
    if (config?.showGeneratedBy !== false) {
      const generatedText = config?.generatedByText || 'Hecho en Colombia con <3 por Halltec';
      
      // Dividir en líneas si es muy largo
      const lines = this.doc.splitTextToSize(generatedText, this.pageWidth - (this.margin * 2));
      lines.forEach((line: string) => {
        this.doc.text(line, this.centerX, this.currentY, { align: 'center' });
        this.currentY += 3;
      });
    }
    
    if (config?.showPageNumber !== false) {
      this.doc.text('página 1 de 1', this.centerX, this.currentY, { align: 'center' });
      this.currentY += 3;
    }
    
    // Agregar margen inferior
    this.currentY += 3;
  }
  
  // Ajustar el tamaño de la página al contenido
  private adjustPageSize(): void {
    this.contentHeight = this.currentY;
    
    // Crear un nuevo documento con el tamaño correcto
    const newDoc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [58, this.contentHeight] // Altura ajustada al contenido
    });
    
    // Copiar el contenido del documento temporal al nuevo
    const pageCount = this.doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      const pageContent = this.doc.output('datauristring');
    }
    
    // Reemplazar el documento
    this.doc = newDoc;
  }
  
  // Método principal para generar el PDF
  public async generate(config: PDFTicketConfig): Promise<void> {
    // Agregar logo
    await this.addLogo(config.companyInfo);
    
    // Agregar información de la empresa
    this.addCompanyInfo(config.companyInfo);
    
    // Línea separadora
    this.addSeparatorLine();
    
    // Agregar información principal
    this.addMainInfo(config.mainInfo);
    
    // Agregar tabla de productos
    this.addProductsTable(config.products);
    
    // Agregar total
    this.addTotal(config.total);
    
    // Agregar pie de página
    this.addFooter(config.footer);
    
    // Ajustar el tamaño de la página al contenido real
    const finalHeight = this.currentY;
    const finalDoc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [58, finalHeight]
    });
    
    // Redibujar todo en el documento final
    this.doc = finalDoc;
    this.currentY = 8;
    
    await this.addLogo(config.companyInfo);
    this.addCompanyInfo(config.companyInfo);
    this.addSeparatorLine();
    this.addMainInfo(config.mainInfo);
    this.addProductsTable(config.products);
    this.addTotal(config.total);
    this.addFooter(config.footer);
    
    // Guardar el PDF
    const fileName = config.fileName || 'ticket.pdf';
    this.doc.save(fileName);
  }
}

// Función para generar PDFs tipo ticket
export const generateTicketPDF = async (config: PDFTicketConfig): Promise<void> => {
  const generator = new PDFTicketGenerator();
  await generator.generate(config);
};

// Hook personalizado para facilitar el uso
export const useTicketPDFGenerator = () => {
  const generate = async (config: PDFTicketConfig) => {
    await generateTicketPDF(config);
  };
  
  return { generate };
};

export default PDFTicketGenerator;