export interface WarehouseRelocationTypes {
  id: number;
  warehouseOriginId: number;
  warehouseNameOrigin: string;
  warehouseDestinationId: number;
  warehouseNameDestination: string;
  productId: number;
  productName: string;
  quantity: number;
  observation: string;
  date: string;
  hour: string;
  userId: number;
  userName: string;
  orderStatus: string;
  status: string;
  products: PurchaseProductDto[];
}

export interface PurchaseProductDto {
  productId: number;
  quantity: number;
}

export interface CreatePurchaseDto {
  supplierId: number;
  userId: number;
  date: string; 
  observation: string;
  transactionTotal: number;
  purchaseStatus: string; 
  products: PurchaseProductDto[];
}




