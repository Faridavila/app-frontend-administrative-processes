import { ProductTypes } from "../Types/InventoryTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

const URL: string = `${BASE_URL_APIS_CORE}/product`;

export const GetProduct = async (
  page: number,
  size: number,
  filters: Partial<ProductTypes>,
  sortOrder: string = 'ASC',
  sortBy?: keyof ProductTypes
): Promise<ProductTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ProductTypes];
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Productos obtenidos:', data.content?.length || 0);
    return data.content || [];
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    return [];
  }
};

export const GetSearchProduct = async (
  page: number,
  size: number,
  filters: Partial<ProductTypes>,
  sortOrder: string = 'ASC',
  sortBy?: keyof ProductTypes
): Promise<ProductTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ProductTypes];
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}/search?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('🔍 Búsqueda completada:', data.content?.length || 0, 'resultados');
    return data.content || [];
  } catch (error) {
    console.error('❌ Error al buscar productos:', error);
    return [];
  }
};

export async function GetAllProductNoPage(): Promise<ProductTypes[]> {
  try {
    const response = await fetch(`${URL}/no-page/getAllProduct`);
    
    if (!response.ok) {
      throw new Error(`La solicitud a la API falló: ${response.status}`);
    }
    
    const data: ProductTypes[] = await response.json();
    console.log('✅ Total de productos sin paginación:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener productos sin paginación:', error);
    return [];
  }
}

export async function UpdateIntoryAdd(batchData: ProductTypes): Promise<void> {
  try {
    console.log('📦 Enviando batch para AGREGAR inventario:', batchData);
    
    const response = await fetch(`${URL}/add-quantity`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al agregar inventario (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Inventario agregado exitosamente:', result);
  } catch (error) {
    console.error('❌ Error al agregar inventario:', error);
    throw error;
  }
}

export async function UpdateIntorySubtract(batchData: ProductTypes): Promise<void> {
  try {
    console.log('📦 Enviando batch para RESTAR inventario:', batchData);
    
    const response = await fetch(`${URL}/subtract-quantity`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al restar inventario (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Inventario restado exitosamente:', result);
  } catch (error) {
    console.error('❌ Error al restar inventario:', error);
    throw error;
  }
}
