import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { UserTypes } from "../Types/UserTypes";
import { BASE_URL_APIS_USER } from "../../constants";

//const URL = 'http://localhost:8081/api/v1/back-user-service/user';
const URL: string = `${BASE_URL_APIS_USER}/user`;

export const GetUser = async (
  page: number,
  size: number,
  filters: Partial<UserTypes>,
  sortOrder: string = '',  
  sortBy?: keyof UserTypes
): Promise<UserTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof UserTypes];
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}/get-all-page?${queryParams.toString()}`);
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


export async function CreateUser(UserDto: UserTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(UserDto),
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        throw error;
    }
}

export const GetSearchUser = async (
  page: number,
  size: number,
  filters: Partial<UserTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof UserTypes 
): Promise<UserTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof UserTypes];
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


export async function UpdateUser(id: number, UserDto: UserTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(UserDto),
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        throw error;
    }
}


export async function DeleteUser(id: number): Promise<void> {
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


export async function GetAllUseresNoPage(): Promise<UserTypes[] | null> {
    try {
        const response = await fetch(`${URL}/get-all-page`);
        if (response.ok) {
            const data: UserTypes[] = await response.json();
            return data;
        } else {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return null;
    }
}


export async function GetAllUserByTerminal(terminalId?: number): Promise<UserTypes[] | null> {
    try {
        const params = terminalId ? `?terminalId=${terminalId}` : '';
        const response = await fetch(`${URL}/get-all-terminal-by-user${params}`);
        
        if (response.ok) {
            const data: UserTypes[] = await response.json();
            return data;
        } else {
            throw new Error(`La solicitud a la API falló ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return null;
    }
}
export async function GetAllUserByRol(): Promise<UserTypes[] | null> {
    try {
        const response = await fetch(`${URL}/get-all-rol-by-user`);
        if (response.ok) {
            const data: UserTypes[] = await response.json();
            return data;
        } else {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return null;
    }
}
