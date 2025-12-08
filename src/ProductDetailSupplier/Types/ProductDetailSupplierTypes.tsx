export interface ProductDetailSupplierTypes {
  id: number;
  productId: number;
  productName: string;
  purchasePrice: number;
  quantity: number;
  total: number;
  status: string;
}

export interface GetProductParams {
  shoppingSupplierId: number;
} 
