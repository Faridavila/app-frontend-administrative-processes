import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import {AccountingDocumentTypesTypes } from "../Types/AccountingDocumentTypesTypes";
//import { BASE_URL_APIS_CORE } from "../../constants";

const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/accounting-document-type';
//const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/AccountingDocumentTypes`;

export async function GetAccountingDocumentTypesId(id: number): Promise<ObjectResponse<AccountingDocumentTypesTypes> | null> {
    try {
        const response = await fetch(`${URL}/get/${id}`);
        if (response.ok) {
            const data: ObjectResponse<AccountingDocumentTypesTypes> = await response.json();
            return data;
        } else {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return null;
    }
}

export const GetAccountingDocumentTypes = async (
  page: number,
  size: number,
  filters: Partial<AccountingDocumentTypesTypes>,
  sortOrder: string = '',  
  sortBy?: keyof AccountingDocumentTypesTypes
): Promise<AccountingDocumentTypesTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof AccountingDocumentTypesTypes];
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    const data = await response.json();
    return data.content; 
  } catch (error) {
    console.error('Error al obtener los elementos:', error);
    return [];
  }
};


export async function CreateAccountingDocumentTypes(branchDto:AccountingDocumentTypesTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(branchDto),
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
    }
}

export const GetSearchAccountingDocumentTypes = async (
  page: number,
  size: number,
  filters: Partial<AccountingDocumentTypesTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof AccountingDocumentTypesTypes 
): Promise<AccountingDocumentTypesTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof AccountingDocumentTypesTypes];
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}/search?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error al obtener los elementos:', error);
    return [];
  }
};



export async function UpdateAccountingDocumentTypes(id: number, branchDto:AccountingDocumentTypesTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/update/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(branchDto),
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
    }
}


export async function DeleteAccountingDocumentTypes(id: number): Promise<void> {
    try {
        const response = await fetch(`${URL}/delete/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
    }
}


export async function GetAllAccountingDocumentTypesNoPage(): Promise<AccountingDocumentTypesTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllAccountingDocumentTypes`);
      if (response.ok) {
          const data:AccountingDocumentTypesTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}



