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
  phone: string;
  address: string;
  invoiceDate: string; 
  dueDate?: string | null;
  paymentTypeId: number; 
  paymentMethodId: number;
  deliveryType: "LLEVAR" | "RECOGER";
  deliveryCost: number;
  commission: boolean;
  observations: string;
  totalDiscount: number;
  total: number;
  subtotal: number;
  initialPayment?: number;
  remainingBalance?: number;
  cashReceived?: number;
  changeGiven?: number;
  userId: number;
  statusBill: string;
  invoiceDetails: InvoiceDetail[];
}