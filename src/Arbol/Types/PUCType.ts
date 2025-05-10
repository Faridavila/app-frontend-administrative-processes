export interface AuxiliaryAccount {
  id: number;
  code: string;
  name: string;
  subAccountingAccountId: number; 
  status?: string;
  level: number; 
  children?: AuxiliaryAccount[];
}

export interface TreeNode {
  id: number; 
  code: string;
  name: string;
  subAccountingAccountId?: number;  
  accountingAccountClassId?: number;  
  accountingAccountGroupId?: number;  
  accountingAccountId?: number;       
  status?: string;
  level: number; 
  children?: TreeNode[];
}

export interface AccountClass {
  accountingAccountClassId: number;
  accountingAccountClassCode: string;
  accountingAccountClassName: string;
}

export interface AccountGroup {
  accountingAccountGroupId: number;
  accountingAccountGroupCode: string;
  accountingAccountGroupName: string;
}

export interface Account {
  accountingAccountId: number;
  accountingAccountCode: string;
  accountingAccountName: string;
}

export interface SubAccount {
  subAccountingAccountId: number;
  subAccountingAccountCode: string;
  subAccountingAccountName: string;
}

export interface AuxiliaryAccount {
  accountingAuxiliaryAccountId: number;
  accountingAuxiliaryAccountCode: string;
  accountingAuxiliaryAccountName: string;
}

