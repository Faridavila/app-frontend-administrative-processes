export interface InvoiceDetail {
  productId: number;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountFixed: number;
  totalDiscount: number;
  subtotal: number;
  total: number;
}

export interface GenerateInvoiceType {
  customerId: number;
  invoiceDate: string; // ISO: "2025-12-04T15:30:00"
  dueDate?: string | null;
  paymentTypeId: number; // 1 = contado, 2 = crédito, 3 = abono
  paymentMethodId: number;
  deliveryType: "LLEVAR" | "RECOGER";
  deliveryCost: number;
  observations: string;
  totalDiscount: number;
  total: number;
  subtotal: number;
  initialPayment?: number;
  remainingBalance?: number;
  cashReceived?: number;
  changeGiven?: number;
  invoiceDetails: InvoiceDetail[];
}