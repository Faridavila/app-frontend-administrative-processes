import { SupplierTypes } from "../Types/SuppliersTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/supplier';
const URL: string = `${BASE_URL_APIS_CORE}/supplier`;

export const GetSuppliers = async (
  page: number,
  size: number,
  filters: Partial<SupplierTypes>,
  sortOrder: string = '',  
  sortBy?: keyof SupplierTypes
): Promise<SupplierTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof SupplierTypes];
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}/get-all?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    const data = await response.json();
    return data.content || data; 
  } catch (error) {
    console.error('Error al obtener los elementos:', error);
    throw error;
  }
};


export async function CreateSuppliers(supplierDto: SupplierTypes): Promise<void> {
    try {
        const requestBody = {
            name: supplierDto.name,
            email: supplierDto.email,
            phone: supplierDto.phone,
            warehouseId: supplierDto.warehouseId,
            products: supplierDto.products || [],
        };

        const response = await fetch(`${URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API falló ${response.status}`);
        }
        const data = await response.json();
        console.log("Proveedor creado:", data);
        return data;
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        throw error;
    }
}

export const GetSearchSuppliers = async (
  page: number,
  size: number,
  filters: Partial<SupplierTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof SupplierTypes 
): Promise<SupplierTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof SupplierTypes];
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
    return data.content || data;
  } catch (error) {
    console.error('Error al obtener los elementos:', error);
    return [];
  }
};



export async function UpdateSuppliers(id: number, supplierDto: SupplierTypes): Promise<void> {
    try {
        const requestBody = {
            name: supplierDto.name,
            email: supplierDto.email,
            phone: supplierDto.phone,
            warehouseId: supplierDto.warehouseId,
            products: supplierDto.products || [],
        };

        const response = await fetch(`${URL}/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API falló ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        throw error;
    }
}


export async function DeleteSuppliers(id: number): Promise<void> {
    try {
        const response = await fetch(`${URL}/delete/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API falló ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        throw error;
    }
}


export async function GetAllSuppliersNoPage(): Promise<SupplierTypes[] | null> {
  try {
      const response = await fetch(`${URL}/get-all/no-page`);
      if (response.ok) {
          const data: SupplierTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}


