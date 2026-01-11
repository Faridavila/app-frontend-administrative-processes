export interface CompleteOrderHistoryTypes {
  id: number;
  userId: number;
  userName: string;
  warehouseId: number;
  warehouseName: string;
  neighborhoodRateId: number;
  neighborhoodName: string;
  address: string;
  orderId: number;
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerPhone: string;
  totalPurchase: number;
  date: string;
  hour: string;
  imageEvidence: string;
  signature: string;
  observation: string;
  statusOrder: string;
  status: string;
  products: OrderProduct[];
}

export interface OrderProduct {
  id: number;
  productName: string;
  quantity: number;
  quantityPerTrip: number; 
  price: number;
  total: number;
}





