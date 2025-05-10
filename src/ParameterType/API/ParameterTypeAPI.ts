import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { ParameterTypeTypes } from "../Types/ParameterTypeTypes";
import { BASE_URL_APIS_WORKFLOW } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/currency-type';
const URL: string = `${BASE_URL_APIS_WORKFLOW}/api/v1/back-app-workflow-enguine-service/parameter-type`;

export async function GetParameterTypeId(id: number): Promise<ObjectResponse<ParameterTypeTypes> | null> {
    try {
        const response = await fetch(`${URL}/get/${id}`);
        if (response.ok) {
            const data: ObjectResponse<ParameterTypeTypes> = await response.json();
            return data;
        } else {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return null;
    }
}

export const GetParameterType = async (
  page: number,
  size: number,
  filters: Partial<ParameterTypeTypes>,
  sortOrder: string = '',  
  sortBy?: keyof ParameterTypeTypes
): Promise<ParameterTypeTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ParameterTypeTypes];
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


export async function CreateParameterType(branchDto: ParameterTypeTypes): Promise<void> {
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

export const GetSearchParameterType = async (
  page: number,
  size: number,
  filters: Partial<ParameterTypeTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof ParameterTypeTypes 
): Promise<ParameterTypeTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ParameterTypeTypes];
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



export async function UpdateParameterType(id: number, branchDto: ParameterTypeTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/update/${id}`, {
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
    }
}


export async function DeleteParameterType(id: number): Promise<void> {
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


export async function GetAllParameterTypeNoPage(): Promise<ParameterTypeTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page`);
      if (response.ok) {
          const data: ParameterTypeTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}



