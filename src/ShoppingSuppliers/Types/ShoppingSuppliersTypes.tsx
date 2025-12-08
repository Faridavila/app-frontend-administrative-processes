export interface ShoppingSuppliersTypes {
  id: number;
  supplierId: number;
  supplierName: string;
  warehouseId: number;
  warehouseName: string;
  productId: number;
  productName: string;
  purchasePrice: number;
  purchaseStatus: string;
  remainingAmount: number;
  quantity: number;
  observation: string;
  date: string;
  total: number;
  transactionTotal: number; 
  userId: number;
  status: string;
  products: PurchaseProductDto[];
}

export interface PurchaseProductDto {
  productId: number;
  purchasePrice: number;
  quantity: number;
  total: number;
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




