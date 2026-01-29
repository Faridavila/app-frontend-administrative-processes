export interface CompleteOrderHistoryTypes {
  id: number;
  userId: number;
  transporterName: string;
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
  image: string;
  signature: string;
  observation: string;
  statusOrderAllocation: string;
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





