export interface ProductDetailWarehouseRelocationTypes {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  status: string;
}

export interface GetProductParams {
  shoppingSupplierId: number;
} 
