export interface ProductTypes {
  id: number;
  productName: string;
  price: number;
  description: string;
  categoryId: number;
  categoryName: string;
  quantity: number;
  observation: string;
  userId: number;
  date: string;
  image: string; 
  purchasePrice: number;
  total: number;
  transactionTotal: number;
  productStatus: string;
  status: string;
}


export interface ProductQuantityBatch {
  productQuantity: ProductTypes[];
}




