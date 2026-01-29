export interface AssignOrderTypes {
  id: number;
  userId: number;
  userName: string;
  warehouseId: number;
  warehouseName: string;
  neighborhoodRateId: number;
  neighborhoodName: string;
  paymentMethodId: number;
  paymentMethodName: string;
  address: string;
  orderId: number;
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerPhone: string;
  totalPurchase: number;
  date: string;
  hour: string;
  observation: string;
  statusOrder: string;
  status: string;
  chargeInvoice?: boolean;
  products: OrderProduct[];
}

export interface OrderProduct {
  id: number; // productId
  productName: string;
  quantity: number; // Cantidad total del pedido original
  quantityPerTrip: number; // assignedQuantity en backend
  price: number; // unitPrice
  total: number;
  pendingOrderDetailId?: number; // ⚠️ IMPORTANTE: debe venir del pedido original
}