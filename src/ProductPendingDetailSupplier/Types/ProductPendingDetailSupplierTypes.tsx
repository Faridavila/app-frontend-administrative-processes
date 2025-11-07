export interface ProductPendingDetailSupplierTypes {
  id: number;
  productId: number;
  productName: string;
  remainingAmount: number;
  status: string;
}

export interface GetProductParams {
  supplierId: number;
} 

