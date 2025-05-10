import { TreeNode,AccountClass,AccountGroup,Account,SubAccount,AuxiliaryAccount } from '../Types/PUCType';
import {BASE_URL_APIS_CORE} from "../../constants";

//const apiUrl = 'http://localhost:8080/api/v1/back-app-catalog-core-service/accounting';
const apiUrl: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/accounting`;


export const fetchAllAccountClasses = async (): Promise<TreeNode[]> => {
  const response = await fetch(`${apiUrl}/get-all-account-classes`);
  if (!response.ok) {
    throw new Error('Error al obtener las clases de cuentas');
  }
  const data: AccountClass[] = await response.json();
  return data.map((item: AccountClass) => ({
    id: item.accountingAccountClassId,
    level: 1,
    code: item.accountingAccountClassCode,
    name: item.accountingAccountClassName,
    children: []
  }));
};

export const fetchAllAccountGroups = async (classId: number): Promise<TreeNode[]> => {
  const response = await fetch(`${apiUrl}/get-all-account-groups-by-class-id/${classId}`);
  if (!response.ok) {
    throw new Error('Error al obtener los grupos de cuentas');
  }
  const data: AccountGroup[] = await response.json();
  return data.map((item: AccountGroup) => ({
    id: item.accountingAccountGroupId,
    level: 2,
    code: item.accountingAccountGroupCode,
    name: item.accountingAccountGroupName,
    children: []
  }));
};

export const fetchAllAccounts = async (groupId: number): Promise<TreeNode[]> => {
  const response = await fetch(`${apiUrl}/get-all-accounts-by-account-group-id/${groupId}`);
  if (!response.ok) {
    throw new Error('Error al obtener las cuentas contables');
  }
  const data: Account[] = await response.json();
  return data.map((item: Account) => ({
    id: item.accountingAccountId,
    level: 3,
    code: item.accountingAccountCode,
    name: item.accountingAccountName,
    children: []
  }));
};

export const fetchAllSubAccounts = async (accountId: number): Promise<TreeNode[]> => {
  const response = await fetch(`${apiUrl}/get-all-sub-accounts-by-account-id/${accountId}`);
  if (!response.ok) {
    throw new Error('Error al obtener las subcuentas');
  }
  const data: SubAccount[] = await response.json();
  return data.map((item: SubAccount) => ({
    id: item.subAccountingAccountId,
    level: 4,
    code: item.subAccountingAccountCode,
    name: item.subAccountingAccountName,
    children: [] 
  }));
};

export const fetchAuxiliaryAccountsBySubAccountId = async (subAccountId: number): Promise<TreeNode[]> => {
  const response = await fetch(`${apiUrl}/get-auxiliary-accounts/${subAccountId}`);
  if (!response.ok) {
    throw new Error('Error al obtener las cuentas auxiliares para la subcuenta con ID: ' + subAccountId);
  }
  const data: AuxiliaryAccount[] = await response.json();
  return data.map((item: AuxiliaryAccount) => ({
    id: item.accountingAuxiliaryAccountId,
    level: 5,
    code: item.accountingAuxiliaryAccountCode,
    name: item.accountingAuxiliaryAccountName,
    children: []
  }));
};

export const createAuxiliaryAccount = async (auxiliaryAccount: TreeNode): Promise<TreeNode> => {
  const response = await fetch(`${apiUrl}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(auxiliaryAccount),
  });
  if (!response.ok) {
    throw new Error('Error al crear la cuenta auxiliar');
  }
  return await response.json();
};

export const updateAuxiliaryAccount = async (id: number, auxiliaryAccount: TreeNode): Promise<TreeNode> => {
  const response = await fetch(`${apiUrl}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(auxiliaryAccount),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar la cuenta auxiliar');
  }
  return await response.json();
};

export const deleteAuxiliaryAccount = async (id: number): Promise<void> => {
  const response = await fetch(`${apiUrl}/delete/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar la cuenta auxiliar');
  }
  return;
};
