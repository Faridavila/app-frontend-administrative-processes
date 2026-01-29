import { ProductDetailPendingOrderTypes,GetProductParams } from "../Types/ProductDetailPendingOrderTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/supplier';
const URL: string = `${BASE_URL_APIS_CORE}/pending-order`;

export const GetProductDetailPendingOrder = async (
  page: number,
  size: number,
  filters: Partial<ProductDetailPendingOrderTypes>,
  sortOrder: string = '',
  sortBy?: keyof ProductDetailPendingOrderTypes,
  extraParams?: GetProductParams
): Promise<ProductDetailPendingOrderTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));
  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof ProductDetailPendingOrderTypes];
    if (value != null) {  
      queryParams.append(key, String(value));
    }
  });

  try {
    const pendingOrderId = extraParams?.pendingOrderId;
  
    if (!pendingOrderId || pendingOrderId === 0) {
      console.error("pendingOrderId no está definido o es inválido. Verifica extraParams");
      return [];
    }

    const apiUrl = `${URL}/getAllProductsByPendingOrder/${pendingOrderId}?${queryParams.toString()}`;
    console.log("URL de la API:", apiUrl);
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data); 
    if (data && data.content) {
      return data.content;
    } else if (data && data.page && data.page.content) {
      return data.page.content;
    } else {
      console.error('No se encontraron datos en la respuesta de la API');
      return [];
    }
  } catch (error) {
    console.error('Error al obtener los elementos:', error);
    return []; 
  }
};

export const GetSearchProductDetailPendingOrder = async (
  page: number,
  size: number,
  filters: Partial<ProductDetailPendingOrderTypes>,
  sortOrder: string = 'ASC',
  sortBy?: keyof ProductDetailPendingOrderTypes,
  extraParams?: Record<string, any>
): Promise<ProductDetailPendingOrderTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ProductDetailPendingOrderTypes];
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  try {
    const pendingOrderId = extraParams?.pendingOrderId;
  
    if (!pendingOrderId || pendingOrderId === 0) {
      console.error("pendingOrderId no está definido o es inválido. Verifica extraParams");
      return [];
    }
    const response = await fetch(`${URL}/products/search/${pendingOrderId}?${queryParams.toString()}`);
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



export async function GetAllProductDetailPendingOrderNoPage(): Promise<ProductDetailPendingOrderTypes[] | null> {
  try {
      const response = await fetch(`${URL}/get-all-without-page`);
      if (response.ok) {
          const data: ProductDetailPendingOrderTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}



