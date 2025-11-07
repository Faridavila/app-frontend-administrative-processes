import {InventoryHistoryTypes } from "../Types/InventoryHistoryTypes";
//import { BASE_URL_APIS_CORE } from "../../constants";

const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/transaction';
//const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/cash-register`;


export const GetInventoryHistory = async (
  page: number,
  size: number,
  filters: Partial<InventoryHistoryTypes>,
  sortOrder: string = '',  
  sortBy?: keyof InventoryHistoryTypes
): Promise<InventoryHistoryTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof InventoryHistoryTypes];
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



export async function CreateInventoryHistory(
  InventoryHistoryDto: InventoryHistoryTypes,
  imageFile: File | null
): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("InventoryHistoryName", InventoryHistoryDto.productName);
    formData.append("quantity", String(Number(InventoryHistoryDto.quantity)));

    if (imageFile) {
      formData.append("image", imageFile); 
    }

    console.log("Data:", InventoryHistoryDto);
    const response = await fetch(`${URL}/create`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }

    const data = await response.json();
    console.log("InventoryHistoryo creado:", data);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;
  }
}

export async function UpdateIntorySubtract( branchDto: InventoryHistoryTypes): Promise<void> {
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

export async function UpdateIntoryAdd( branchDto: InventoryHistoryTypes): Promise<void> {
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

export const GetSearchInventoryHistory = async (
  page: number,
  size: number,
  filters: Partial<InventoryHistoryTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof InventoryHistoryTypes 
): Promise<InventoryHistoryTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof InventoryHistoryTypes];
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


export async function UpdateInventoryHistory(
  id: number,
  InventoryHistoryDto: InventoryHistoryTypes,
  imageFile: File | null
): Promise<void> {
  try {
    const formData = new FormData();
    
    formData.append("InventoryHistoryName", InventoryHistoryDto.productName);
    formData.append("quantity", String(Number(InventoryHistoryDto.quantity)));

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

export async function DeleteInventoryHistory(id: number): Promise<void> {
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


export async function GetAllInventoryHistoryNoPage(): Promise<InventoryHistoryTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllInventoryHistory`);
      if (response.ok) {
          const data:InventoryHistoryTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}



