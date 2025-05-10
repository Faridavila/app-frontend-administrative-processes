export interface RequestTypes {
  id: number;
  requesterName: string;
  requestDate: Date; // Cambiado a tipo Date
  area: string;
  department: string;
  requestNumber: string;
  status: string; // "ACTIVE" o "INACTIVE"
}