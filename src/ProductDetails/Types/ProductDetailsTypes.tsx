export interface ProductDetailsTypes {
  id: number;
  productId: number;
  productName: string;
  purchasePrice: string;
  quantity: number;
  total: number;
  status: string;
}

export interface GetProductParams {
  inventoryId: number;
} 
