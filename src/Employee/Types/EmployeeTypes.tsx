export interface EmployeeTypes {
  id: number;
  name: string;
  typeIdentificationId: number;
  typeIdentificationName: string;
  identification: number;
  areaId: number;
  areaName: string;
  positionId: number;
  positionName: string;
  date: string;
  email: string;
  address: string;
  phone: number;
  hasBaseSalary: boolean;
  baseSalary: number | undefined;
  status: string;
}
