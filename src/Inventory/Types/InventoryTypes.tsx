export interface ProductTypes {
  id: number;
  productName: string;
  price: number;
  description: string;
  quantity: number;
  categoryId: number;
  userId: number;
  categoryName: string;
  observation: string;
  purchasePrice: number;
  total: number;
  transactionTotal: number;
  date: string;
  image: string;
  productStatus: string;
  status: string;
}


export interface ProductQuantityTransaction {
  id: number;
  quantity: number;
  date: string;
  observation: string;
  purchasePrice: number;
  total: number;
  transactionTotal: number;
  userId: number;
}


export interface ProductQuantityBatch {
  productQuantity: ProductQuantityTransaction[];
}

export interface InventoryOperation {
  productQuantity: Array<{
    id: number;
    quantity: number;
    purchasePrice: number;
    total: number;
    transactionTotal: number;
    date: string;
    observation: string;
    userId: number;
  }>;
}
