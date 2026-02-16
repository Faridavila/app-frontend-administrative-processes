import { EmployeeHistoryTypes } from "../Types/EmployeeHistoryTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

//const URL = 'http://localhost:8081/api/v1/back-user-service/EmployeeHistory';}
const URL: string = `${BASE_URL_APIS_CORE}/employee`;

export const GetEmployeeHistory = async (
  page: number,
  size: number,
  filters: Partial<EmployeeHistoryTypes>,
  sortOrder: string = '',  
  sortBy?: keyof EmployeeHistoryTypes
): Promise<EmployeeHistoryTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof EmployeeHistoryTypes];
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}/get-all-payment?${queryParams.toString()}`);
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


export const GetSearchEmployeeHistory = async (
  page: number,
  size: number,
  filters: Partial<EmployeeHistoryTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof EmployeeHistoryTypes 
): Promise<EmployeeHistoryTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof EmployeeHistoryTypes];
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}/search-payment?${queryParams.toString()}`);
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



export async function GetAllEmployeePaymentNoPage(): Promise<EmployeeHistoryTypes[] | null> {
  try {
      const response = await fetch(`${URL}/get-all-payment-no-page`);
      if (response.ok) {
          const data:EmployeeHistoryTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}





