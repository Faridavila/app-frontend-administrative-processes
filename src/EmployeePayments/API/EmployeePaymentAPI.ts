import {EmployeePaymentTypes } from "../Types/EmployeePaymentTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/transaction-employee';
const URL: string = `${BASE_URL_APIS_CORE}/transaction-employee`;
export const GetEmployeePayment = async (
  page: number,
  size: number,
  filters: Partial<EmployeePaymentTypes>,
  sortOrder: string = '',  
  sortBy?: keyof EmployeePaymentTypes,
  startDate?: string,  
  endDate?: string     
): Promise<EmployeePaymentTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  if (startDate) {
    queryParams.append('startDate', startDate);
  }
  if (endDate) {
    queryParams.append('endDate', endDate);
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof EmployeePaymentTypes];
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
   throw error;
  }
};



export async function CreateEmployeePayment(branchDto: EmployeePaymentTypes): Promise<void> {
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
        throw error;
    }
}

export const GetSearchEmployeePayment = async (
  page: number,
  size: number,
  filters: Partial<EmployeePaymentTypes>,
  sortOrder: string = '',  
  sortBy?: keyof EmployeePaymentTypes,
  startDate?: string,
  endDate?: string
): Promise<EmployeePaymentTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  if (startDate) {
    queryParams.append('startDate', startDate);
  }
  if (endDate) {
    queryParams.append('endDate', endDate);
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof EmployeePaymentTypes];
    if (value) {
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
    throw error;
  }
};

export async function GetAllEmployeePaymentNoPage(): Promise<EmployeePaymentTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllEmployee`);
      if (response.ok) {
          const data:EmployeePaymentTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}



