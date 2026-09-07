export interface ClientTypes {
  id: number;
  name : string;
  typeIdentificationId: number | null;
  identificationType: string | null;
  identification: number | null;
  departmentId: number | null;
  departmentName: string;
  municipalityId: number | null;
  municipality: string;
  neighborhood: string;
  address: string;
  phone: string;
  email:string;
  verificationDigit: number | null;
  personTypeId: number | null;
  personType: string;
  taxLiabilityId: number | null;
  taxLiability: string;
  status: string;
  commission?: boolean;
}
