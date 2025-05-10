export interface RequestDetailTypes {
  id: number;
  itemCode: string; // Debería coincidir con el nombre del campo en el backend (item_code)
  description: string;
  destination: string;
  itemType: string;
  requestedQuantity: number;
  observations: string;
  requestId: number; // Clave foránea, debería coincidir con el backend (request_id)
  status: string;
}
