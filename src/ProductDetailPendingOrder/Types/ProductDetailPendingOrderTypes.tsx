export interface ProductDetailPendingOrderTypes {
  id: number;
  productId: number;
  productName: string;
  salePrice: number;
  quantity: number;
  total: number;
  discount: number;
  status: string;
}

export interface GetProductParams {
  pendingOrderId: number;
} 
