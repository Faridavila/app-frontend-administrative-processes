import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { ParameterTypes } from "../Types/ParameterTypes";
import { BASE_URL_APIS_WORKFLOW } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/currency-type';
const URL: string = `${BASE_URL_APIS_WORKFLOW}/api/v1/back-app-workflow-enguine-service/parameter`;

export async function GetParameterId(id: number): Promise<ObjectResponse<ParameterTypes> | null> {
    try {
        const response = await fetch(`${URL}/get/${id}`);
        if (response.ok) {
            const data: ObjectResponse<ParameterTypes> = await response.json();
            return data;
        } else {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return null;
    }
}

export const GetParameter = async (
  page: number,
  size: number,
  filters: Partial<ParameterTypes>,
  sortOrder: string = '',  
  sortBy?: keyof ParameterTypes
): Promise<ParameterTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ParameterTypes];
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


export async function CreateParameter(branchDto: ParameterTypes): Promise<void> {
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

export const GetSearchParameter = async (
  page: number,
  size: number,
  filters: Partial<ParameterTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof ParameterTypes 
): Promise<ParameterTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ParameterTypes];
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



export async function UpdateParameter(id: number, branchDto: ParameterTypes): Promise<void> {
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


export async function DeleteParameter(id: number): Promise<void> {
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


export async function GetAllParameterNoPage(): Promise<ParameterTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page`);
      if (response.ok) {
          const data: ParameterTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}



