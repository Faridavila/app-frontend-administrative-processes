import {ClientTypes } from "../Types/ClientTypes";
import {IdentificationTypeTypes} from '../Types/IdentificacionTypeTypes'
import { TypePersonTypes } from "../Types/TypePersonType";
import { TaxLiabilityTypes } from "../Types/TaxLiabilityTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/client';
const URL: string = `${BASE_URL_APIS_CORE}/client`;
const URL_TAX: string = `${BASE_URL_APIS_CORE}/tax-liability`;
const URL_TYPE_PERSON: string = `${BASE_URL_APIS_CORE}/type-person`;
const URL_IDENTIFICATION: string = `${BASE_URL_APIS_CORE}/identification-type`;


export const GetClient = async (
  page: number,
  size: number,
  filters: Partial<ClientTypes>,
  sortOrder: string = '',  
  sortBy?: keyof ClientTypes
): Promise<ClientTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ClientTypes];
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

export async function CreateClient(branchDto: ClientTypes): Promise<ClientTypes> {
    try {
        const response = await fetch(`${URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(branchDto),
        });
        
        if (!response.ok) {
            throw new Error(`La solicitud a la API falló ${response.status}`);
        }
        
        // ✅ CAMBIO PRINCIPAL: Retornar el cliente creado
        const clienteCreado = await response.json();
        return clienteCreado;
        
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        throw error;
    }
}

export const GetSearchClient = async (
  page: number,
  size: number,
  filters: Partial<ClientTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof ClientTypes 
): Promise<ClientTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ClientTypes];
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



export async function UpdateClient(id: number, branchDto:ClientTypes): Promise<void> {
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
        throw error;
    }
}


export async function DeleteClient(id: number): Promise<void> {
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

export async function GetAllClientNoPage(): Promise<ClientTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllClient`);
      if (response.ok) {
          const data: ClientTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}

export async function GetAllIdentificationType(): Promise<IdentificationTypeTypes[]> {
  try {
    const response = await fetch(`${URL_IDENTIFICATION}/no-page/getAll`);
    if (response.ok) {
      const data: IdentificationTypeTypes[] = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return [];
  }
}



export async function GetAllTypePerson(): Promise<TypePersonTypes[]> {
  try {
    const response = await fetch(`${URL_TYPE_PERSON}/no-page/getAll`);
    if (response.ok) {
      const data: TypePersonTypes[] = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return [];
  }
}


export async function GetAllTaxLiability(): Promise<TaxLiabilityTypes[]> {
  try {
    const response = await fetch(`${URL_TAX}/no-page/getAll`);
    if (response.ok) {
      const data: TaxLiabilityTypes[] = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return [];
  }
}





