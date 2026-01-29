import {CompleteOrderHistoryTypes } from "../Types/CompleteOrderHistoryTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/supplier';
const URL: string = `${BASE_URL_APIS_CORE}/order-allocation`;

export const GetCompleteOrderHistory = async (
   page: number,
    size: number,
    filters: Partial<CompleteOrderHistoryTypes>,
    sortOrder: string = '',  
    sortBy?: keyof CompleteOrderHistoryTypes
  ): Promise<CompleteOrderHistoryTypes[]> => {
    const queryParams = new URLSearchParams();
  
    queryParams.append('page', String(page));
    queryParams.append('size', String(size));
  
    const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
    queryParams.append('orders', validSortOrder);
  
    if (sortBy) {
      queryParams.append('sortBy', String(sortBy)); 
    }
  
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof CompleteOrderHistoryTypes];
      if (value) {
        queryParams.append(key, String(value));
      }
    });
  
    try {
      const response = await fetch(`${URL}/get-all-complete?${queryParams.toString()}`);
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



export async function GetAllCompleteOrderHistoryNoPage(): Promise<CompleteOrderHistoryTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllCompleteOrderHistory`);
      if (response.ok) {
          const data:CompleteOrderHistoryTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}

export const GetPurchasePrice = async (
  supplierId: number,
  productId: number
): Promise<number> => {
  try {
    const endpoint = `${URL}/get-purchase-price/${supplierId}/${productId}`;
    console.log(`Llamando al endpoint: ${endpoint}`); 

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data);
    const price = typeof data === 'number' ? data : parseFloat(data.toString());
    
    if (isNaN(price)) {
      throw new Error('El valor devuelto no es un número válido');
    }

    return price;
  } catch (error) {
    console.error('Error al obtener el precio de compra:', error);
    throw error; 
  }
};



