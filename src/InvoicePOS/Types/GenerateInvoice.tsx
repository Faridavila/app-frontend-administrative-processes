export interface GenerateInvoiceType {
  id: number;                    
  invoiceNumber: string;      
  customerId: string;            
  numerationPrefixId: string;     
  total: number;
  sellerId: number;
  cashRegisterId: number;
  status: string;          
}
