import { ProductDetailSupplierTypes,GetProductParams } from "../Types/ProductDetailSupplierTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/supplier';
const URL: string = `${BASE_URL_APIS_CORE}/supplier`;

export const GetProductDetailSupplier = async (
  page: number,
  size: number,
  filters: Partial<ProductDetailSupplierTypes>,
  sortOrder: string = '',
  sortBy?: keyof ProductDetailSupplierTypes,
  extraParams?: GetProductParams
): Promise<ProductDetailSupplierTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));
  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof ProductDetailSupplierTypes];
    if (value != null) {  
      queryParams.append(key, String(value));
    }
  });

  try {
    const shoppingSupplierId = extraParams?.shoppingSupplierId;
  
    if (!shoppingSupplierId || shoppingSupplierId === 0) {
      console.error("supplierId no está definido o es inválido. Verifica extraParams");
      return [];
    }

    const apiUrl = `${URL}/purchase/getAllProductByPurchaseId/${shoppingSupplierId}?${queryParams.toString()}`;
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


export const GetSearchProductDetailSupplier = async (
    page: number,
    size: number,
    filters: Partial<ProductDetailSupplierTypes>,
    sortOrder: string = 'ASC',
    sortBy?: keyof ProductDetailSupplierTypes,
    extraParams?: Record<string, any>
  ): Promise<ProductDetailSupplierTypes[]> => {
    const queryParams = new URLSearchParams();
  
    queryParams.append('page', String(page));
    queryParams.append('size', String(size));
  
    const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
    queryParams.append('orders', validSortOrder);
  
    if (sortBy) {
      queryParams.append('sortBy', String(sortBy));
    }
  
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof ProductDetailSupplierTypes];
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  
    try {
         const shoppingSupplierId = extraParams?.shoppingSupplierId;

      if (!shoppingSupplierId || shoppingSupplierId === 0) {
        console.error("shoppingSupplierId no está definido o es inválido. Verifica extraParams");
        return [];
      }
      const response = await fetch(`${URL}/products/searchProductByPurchase/${shoppingSupplierId}?${queryParams.toString()}`);
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
  


export async function GetAllProductDetailSupplierNoPage(): Promise<ProductDetailSupplierTypes[] | null> {
  try {
      const response = await fetch(`${URL}/get-all-without-page`);
      if (response.ok) {
          const data: ProductDetailSupplierTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}



