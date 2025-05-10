import { CompanyType } from "../Types/Company";
import {BASE_URL_APIS_CORE} from "../../constants/index";

//const API_URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/company';
const API_URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/company`;

export const GetCompany = async (): Promise<CompanyType> => {
  const response = await fetch(`${API_URL}/all`);
  if (!response.ok) {
    throw new Error(`La solicitud a la API fallo: ${response.statusText}`);
  }
  const data: CompanyType = await response.json(); 
  return data;
};


export async function GetCompanyById(id: number): Promise<CompanyType | null> {
  try {
    const response = await fetch(`${API_URL}/get/${1}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`Error al cargar el ID de company ${id}: ${response.status} - ${await response.text()}`);
      return null;  
    }
  } catch (error) {
    console.error(`Error en el ID ${id}:`, error);
    return null;  
  }
}



export const UpdateCompany = async (company: CompanyType): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/update/${1}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(company),
    });

    return response.ok; 
  } catch (error) {
    console.error("Error al actualizar company:", error);
    return false; 
  }
};


/*API CRUD*/


export const GetCompanyCRUD= async (
page: number,
size: number,
filters: Partial<CompanyType>,
sortOrder: string = '',  
sortBy?: keyof CompanyType
): Promise<CompanyType[]> => {
const queryParams = new URLSearchParams();

queryParams.append('page', String(page));
queryParams.append('size', String(size));

const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
queryParams.append('orders', validSortOrder);

if (sortBy) {
  queryParams.append('sortBy', String(sortBy)); 
}

Object.keys(filters).forEach(key => {
  const value = filters[key as keyof CompanyType];
  if (value) {
    queryParams.append(key, String(value));
  }
});

try {
  const response = await fetch(`${API_URL}?${queryParams.toString()}`);
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


export async function CreateCompanyCRUD(branchDto: CompanyType): Promise<void> {
  try {
      const response = await fetch(`${API_URL}/create`, {
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

export const GetSearchCompanyCRUD = async (
page: number,
size: number,
filters: Partial<CompanyType>,
sortOrder: string = 'ASC',  
sortBy?: keyof CompanyType 
): Promise<CompanyType[]> => {
const queryParams = new URLSearchParams();

queryParams.append('page', String(page));
queryParams.append('size', String(size));


const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
queryParams.append('orders', validSortOrder);

if (sortBy) {
  queryParams.append('sortBy', String(sortBy));
}


Object.keys(filters).forEach(key => {
  const value = filters[key as keyof CompanyType];
  if (value !== undefined && value !== null && value !== '') {
    queryParams.append(key, String(value));
  }
});

try {
  const response = await fetch(`${API_URL}/search?${queryParams.toString()}`);
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





export async function UpdateCompanyCRUD(id: number, branchDto: CompanyType): Promise<void> {
  try {
      const response = await fetch(`${API_URL}/update/${id}`, {
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


export async function DeleteCompanyCRUD(id: number): Promise<void> {
  try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
          method: "DELETE",
      });
      if (!response.ok) {
          throw new Error(`La solicitud a la API fallo ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
  }
}


export async function GetAllCompanyCRUDNoPage(): Promise<CompanyType[] | null> {
try {
    const response = await fetch(`${API_URL}/no-page`);
    if (response.ok) {
        const data: CompanyType[] = await response.json();
        return data;
    } else {
        throw new Error(`La solicitud a la API falló ${response.status}`);
    }
} catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
}
}




