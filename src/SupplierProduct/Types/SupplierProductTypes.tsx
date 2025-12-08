export interface SupplierProductTypes {
  id: number;
  productId: number;
  productName: string;
  purchasePrice: string;
  status: string;
}

export interface GetProductParams {
  supplierId: number;
} 
