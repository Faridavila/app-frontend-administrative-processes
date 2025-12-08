import {AssignOrderTypes } from "../Types/AssignOrderTypes";
//import { BASE_URL_APIS_CORE } from "../../constants";

const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/supplier';
//const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/cash-register`;

export const GetAssignOrder = async (
  page: number,
  size: number,
  filters: Partial<AssignOrderTypes>,
  sortOrder: string = '',  
  sortBy?: keyof AssignOrderTypes
): Promise<AssignOrderTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof AssignOrderTypes];
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


export async function CreateAssignOrder(
  AssignOrderDto: AssignOrderTypes,
  imageFile: File | null
): Promise<void> {
  try {
    const formData = new FormData();

    if (imageFile) {
      formData.append("image", imageFile); 
    }

    console.log("Data:", AssignOrderDto);
    const response = await fetch(`${URL}/create`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }

    const data = await response.json();
    console.log("AssignOrdero creado:", data);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;
  }
}

export async function UpdateIntorySubtract( branchDto: AssignOrderTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/subtract-quantity`, {
            method: "PUT",
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

export async function UpdateIntoryAdd( branchDto: AssignOrderTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/add-quantity`, {
            method: "PUT",
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

export const GetSearchAssignOrder = async (
  page: number,
  size: number,
  filters: Partial<AssignOrderTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof AssignOrderTypes 
): Promise<AssignOrderTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof AssignOrderTypes];
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


export async function UpdateAssignOrder(
  id: number,
  AssignOrderDto: AssignOrderTypes,
  imageFile: File | null
): Promise<void> {
  try {
    const formData = new FormData();
    

    if (imageFile) {
      formData.append("image", imageFile); 
    }
    const response = await fetch(`${URL}/update/${id}`, {
      method: "PUT",
      body: formData, 
    });

    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }

    const data = await response.json();
    console.log("Categoría actualizada:", data);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;  
  }
}

export async function DeleteAssignOrder(id: number): Promise<void> {
    try {
        const response = await fetch(`${URL}/delete/${id}`, {
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


export async function GetAllAssignOrderNoPage(): Promise<AssignOrderTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllAssignOrder`);
      if (response.ok) {
          const data:AssignOrderTypes[] = await response.json();
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



