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
  invoiceDate: string; 
  dueDate?: string | null;
  paymentTypeId: number; 
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