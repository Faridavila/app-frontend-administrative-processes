import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { CurrencyTypeTypes } from "../Types/CurrencyTypeTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/currency-type';
const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/currency-type`;

export async function GetCurrencyTypeId(id: number): Promise<ObjectResponse<CurrencyTypeTypes> | null> {
    try {
        const response = await fetch(`${URL}/get/${id}`);
        if (response.ok) {
            const data: ObjectResponse<CurrencyTypeTypes> = await response.json();
            return data;
        } else {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return null;
    }
}

export const GetCurrencyType = async (
  page: number,
  size: number,
  filters: Partial<CurrencyTypeTypes>,
  sortOrder: string = '',  
  sortBy?: keyof CurrencyTypeTypes
): Promise<CurrencyTypeTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof CurrencyTypeTypes];
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


export async function CreateCCurrencyType(branchDto: CurrencyTypeTypes): Promise<void> {
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

export const GetSearchCurrencyType = async (
  page: number,
  size: number,
  filters: Partial<CurrencyTypeTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof CurrencyTypeTypes 
): Promise<CurrencyTypeTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof CurrencyTypeTypes];
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



export async function UpdateCurrencyType(id: number, branchDto: CurrencyTypeTypes): Promise<void> {
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


export async function DeleteCurrencyType(id: number): Promise<void> {
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


export async function GetAllCurrencyTypeNoPage(): Promise<CurrencyTypeTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllDepartments`);
      if (response.ok) {
          const data: CurrencyTypeTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}



