import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { CityTypes } from "../Types/CityTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/city';
const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/city`;

export async function GetCityId(id: number): Promise<ObjectResponse<CityTypes> | null> {
    try {
        const response = await fetch(`${URL}/get/${id}`);
        if (response.ok) {
            const data: ObjectResponse<CityTypes> = await response.json();
            return data;
        } else {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return null;
    }
}

export const GetCity = async (
  page: number,
  size: number,
  filters: Partial<CityTypes>,
  sortOrder: string = '',  
  sortBy?: keyof CityTypes
): Promise<CityTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof CityTypes];
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


export async function CreateCity(branchDto: CityTypes): Promise<void> {
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

export const GetSearchCity = async (
  page: number,
  size: number,
  filters: Partial<CityTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof CityTypes 
): Promise<CityTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof CityTypes];
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



export async function UpdateCity(id: number, branchDto: CityTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/update/${id}`, {
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


export async function DeleteCity(id: number): Promise<void> {
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


export async function GetAllCityNoPage(): Promise<CityTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllCities`);
      if (response.ok) {
          const data: CityTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}



