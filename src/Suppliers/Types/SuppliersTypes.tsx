export interface SupplierTypes {
  id: number;
  name: string;
  email: string;
  phone: number;
  warehouseId: number;
  warehouseName: string;
  warehouse: string;
  products?: Array<{
    productId: number;
    purchasePrice: number;
  }>;
  status: string;
}


export interface Products {
  tempId: string;
  id?: number;
  productId: number;
  productName: string;
  purchasePrice: number;
}

