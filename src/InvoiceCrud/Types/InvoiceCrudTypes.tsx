export interface InvoiceCrudTypes {
  id: number;
  invoiceNumber: number;
  customerId: number;
  customerName: string;
  userName: string;
  invoiceDate: string;
  paymentMethodId: number;
  paymentMethodName: string;
  statusBill: string;
  total: number;
  status: string;
}


export interface InvoiceDetailResponse {
  id: number;
  customerId: number;
  customerName: string;
  address: string | null;
  phone: string | null;
  neighborhood: string;
  identification: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string | null;
  paymentTypeId: number;
  paymentMethodId: number;
  paymentMethodName: string;
  deliveryType: string;
  deliveryCost: number;
  observations: string;
  totalDiscount: number;
  total: number;
  subtotal: number;
  initialPayment: number;
  remainingBalance: number;
  cashReceived: number | null;
  userId: number;
  userName: string;
  changeGiven: number | null;
  status: string;
  statusBill: string;
  invoiceDetails: Array<{
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    discountFixed: number;
    totalDiscount: number;
    subtotal: number;
    total: number;
  }>;
}





