// src/PendingOrder/Types/PendingOrderTypes.ts

export interface PendingOrderProductTypes {
  productId: number;
  productName: string;
  purchasePrice: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface PendingOrderTypes {
  id: number;
  billId?: number | null;
  customerId: number;
  customerName: string;
  paymentMethodId: number;
  paymentMethodName: string;
  address: string;
  cityName: string;
  neighborhood: string;
  phone: string;
  total: number;
  date: string
  observations: string;
  statusOrder: string; 
  status: string; 
  products: PendingOrderProductTypes[];
}