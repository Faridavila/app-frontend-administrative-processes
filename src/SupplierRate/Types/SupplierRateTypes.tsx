export interface SupplierRateTypes {
  id: number;
  supplierId: number;
  supplierName: string;
  priceRate: number;
  status: string;
}
export interface GeneralRate {
  addRate: number | null;
  subtractRate: number | null;
}
