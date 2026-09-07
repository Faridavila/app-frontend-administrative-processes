export interface Producto {
  id: number;
  productId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  discountPercent: number;
  discountFixed: number;
  quantity: number;
  price: number;
  discountAmount: number;
  priceDiscount: number;
  totalDiscount: number;
  total: number;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  identification: number | null;
  address: string;
  neighborhood: string;
  cityName: string;
  commission?: boolean;
}   

export interface NewClientData {
  id: number;
  name : string;
  typeIdentificationId: number | null;
  identificationType: string;
  identification: number | null;
  departmentId: number | null;
  departmentName: string;
  municipalityId: number | null;
  municipality: string;
  neighborhood: string;
  address: string;
  phone: string;
  email:string;
  verificationDigit: number | null;
  personTypeId: number | null;
  personType: string;
  taxLiabilityId: number | null;
  taxLiability: string;
  status: string;
}


export interface InvoiceDetail {
  productId: number;
  nombre: string;
  quantity: number;
  price: number;
  discountPercent: number;
  discountFixed: number;
  totalDiscount: number;
  total: number;
}

export interface InvoiceViewOnlyProps {
  invoice: {
    invoiceNumber: string;
    fecha: string;
    cliente: string;
    identificacion: string;
    celular: string;
    direccion: string;
    ciudad: string;
    cajero: string;

    productos: InvoiceDetail[];

    valorBruto: number;
    descuentoTotal: number;
    costoTransporte: number;
    total: number;

    entrega: "recoger" | "llevar";
    metodoPago: string;
    tipoPago: "contado" | "credito" | "abono";
    fechaVencimiento?: string;
    abono?: number;
    restante?: number;
    observacion?: string;

    companyName?: string;
    nit?: string;
    companyAddress?: string;
    companyPhone?: string;
  };
}

