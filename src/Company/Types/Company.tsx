export interface CompanyType {
  id: number;
  companyName: string;
  nit: string;
  address: string;
  email: string;
  phone: string;
  economicActivityId: number;  
  ciiuCode?: string;           
  description?: string;        
  status?: string;          
}


  export interface CompanyTableProps {
    company: CompanyType;
  }
  