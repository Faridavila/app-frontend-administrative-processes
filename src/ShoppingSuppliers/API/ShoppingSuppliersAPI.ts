import {ShoppingSuppliersTypes,CreatePurchaseDto } from "../Types/ShoppingSuppliersTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/supplier';
const URL: string = `${BASE_URL_APIS_CORE}/supplier`;

export const GetShoppingSuppliers = async (
  page: number,
  size: number,
  filters: Partial<ShoppingSuppliersTypes>,
  sortOrder: string = '',  
  sortBy?: keyof ShoppingSuppliersTypes
): Promise<ShoppingSuppliersTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ShoppingSuppliersTypes];
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}/get-all-puchase-supplier?${queryParams.toString()}`);
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


export async function CreateShoppingSuppliers(
  purchaseDto: CreatePurchaseDto
): Promise<void> {
  try {
    const response = await fetch(`${URL}/create-purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(purchaseDto), 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Compra creada:", data);
  } catch (error) {
    console.error("Error al crear la compra:", error);
    throw error; 
  }
}

export const GetSearchShoppingSuppliers = async (
  page: number,
  size: number,
  filters: Partial<ShoppingSuppliersTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof ShoppingSuppliersTypes 
): Promise<ShoppingSuppliersTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ShoppingSuppliersTypes];
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}/purchase/search?${queryParams.toString()}`);
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



export async function DeleteShoppingSuppliers(id: number): Promise<void> {
    try {
        const response = await fetch(`${URL}/purchase/delete/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        throw error;
    }
}


export async function GetAllShoppingSuppliersNoPage(): Promise<ShoppingSuppliersTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllShoppingSuppliers`);
      if (response.ok) {
          const data:ShoppingSuppliersTypes[] = await response.json();
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



