export interface PendingOrderTypes {
  id: number;
  customerId: number;
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerPhone: string;
  totalPurchase: number;
  date: string;
  observation: string;
  statusOrder: string;
  status: string;
  products: OrderProduct[];
}

export interface OrderProduct {
 productId: number;
  purchasePrice: number;
  quantity: number;
  total: number;
}





