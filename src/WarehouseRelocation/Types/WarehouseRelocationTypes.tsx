export interface WarehouseRelocationTypes {
  id: number;
  warehouseOriginId: number;
  warehouseOriginName: string;
  warehouseDestinationId: number;
  warehouseDestinationName: string;
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
  products: ProductDto[];
}

export interface ProductDto {
  productId: number;
  quantity: number;
}

export interface CreatePurchaseDto {
  warehouseOriginId: number;
  warehouseDestinationId: number;
  userId: number;
  date: string; 
  hour: string;
  observation: string;
  products: ProductDto[];
}




