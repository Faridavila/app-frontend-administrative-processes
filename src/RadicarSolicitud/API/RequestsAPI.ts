import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { RequestTypes } from "../Types/RequestTypes"; // Define el tipo de datos para Requests
import { BASE_URL_APIS_CORE } from "../../constants";

// Define la URL base para la API de Requests
const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/requests`;

// Obtener una solicitud por ID
export async function GetRequestId(id: number): Promise<ObjectResponse<RequestTypes> | null> {
    try {
        const response = await fetch(`${URL}/get/${id}`);
        if (response.ok) {
            const data: ObjectResponse<RequestTypes> = await response.json();
            return data;
        } else {
            throw new Error(`La solicitud a la API falló ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return null;
    }
}

// Obtener solicitudes con paginación y filtros
export const GetRequests = async (
  page: number,
  size: number,
  filters: Partial<RequestTypes>,
  sortOrder: string = '',
  sortBy?: keyof RequestTypes
): Promise<RequestTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof RequestTypes];
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

// Crear una nueva solicitud
export async function CreateRequest(requestDto: RequestTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestDto),
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API falló ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
    }
}

// Buscar solicitudes con filtros
export const GetSearchRequests = async (
  page: number,
  size: number,
  filters: Partial<RequestTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof RequestTypes 
): Promise<RequestTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof RequestTypes];
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

// Actualizar una solicitud existente
export async function UpdateRequest(id: number, requestDto: RequestTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/update/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestDto),
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API falló ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
    }
}

// Eliminar una solicitud
export async function DeleteRequest(id: number): Promise<void> {
    try {
        const response = await fetch(`${URL}/delete/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API falló ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
    }
}

// Obtener todas las solicitudes sin paginación
export async function GetAllRequestsNoPage(): Promise<RequestTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllRequests`);
      if (response.ok) {
          const data: RequestTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}
