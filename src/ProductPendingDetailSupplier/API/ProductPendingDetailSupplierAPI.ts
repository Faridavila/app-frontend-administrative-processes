import { ProductPendingDetailSupplierTypes,GetProductParams} from "../Types/ProductPendingDetailSupplierTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

const URL: string = `${BASE_URL_APIS_CORE}/supplier`;


export const GetProductPendingDetailSupplier = async (
  page: number,
  size: number,
  filters: Partial<ProductPendingDetailSupplierTypes>,
  sortOrder: string = 'ASC',
  sortBy?: keyof ProductPendingDetailSupplierTypes,
  extraParams?: GetProductParams
): Promise<ProductPendingDetailSupplierTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));
  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof ProductPendingDetailSupplierTypes];
    if (value != null) {  
      queryParams.append(key, String(value));
    }
  });

  try {
    const pendingDetailSupplierId = extraParams?.pendingDetailSupplierId;
  

    if (!pendingDetailSupplierId || pendingDetailSupplierId === 0) {
      console.warn("⚠️ pendingDetailSupplierId no está definido o es 0. No se realizará la petición.");
      return [];
    }

    const apiUrl = `${URL}/get-all/amountThatSupplierOwes/${pendingDetailSupplierId}?${queryParams.toString()}`;
    console.log("🌐 URL de la API:", apiUrl);
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Respuesta de la API:', data); 

    if (data && Array.isArray(data)) {
      return data;
    } else if (data && data.content && Array.isArray(data.content)) {
      return data.content;
    } else if (data && data.page && data.page.content && Array.isArray(data.page.content)) {
      return data.page.content;
    } else {
      console.error('❌ No se encontraron datos en la respuesta de la API');
      return [];
    }
  } catch (error) {
    console.error('❌ Error al obtener los elementos:', error);
    return []; 
  }
};


export const GetSearchProductPendingDetailSupplier  = async (
    page: number,
    size: number,
    filters: Partial<ProductPendingDetailSupplierTypes>,
    sortOrder: string = 'ASC',
    sortBy?: keyof ProductPendingDetailSupplierTypes,
    extraParams?: Record<string, any>
  ): Promise<ProductPendingDetailSupplierTypes[]> => {
    const queryParams = new URLSearchParams();
  
    queryParams.append('page', String(page));
    queryParams.append('size', String(size));
  
    const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
    queryParams.append('orders', validSortOrder);
  
    if (sortBy) {
      queryParams.append('sortBy', String(sortBy));
    }
  
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof ProductPendingDetailSupplierTypes];
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  
    try {
         const pendingDetailSupplierId = extraParams?.pendingDetailSupplierId;

      if (!pendingDetailSupplierId || pendingDetailSupplierId === 0) {
        console.error("pendingDetailSupplierId no está definido o es inválido. Verifica extraParams");
        return [];
      }
      const response = await fetch(`${URL}/products/searchProductByAmountThatSupplierOwes/${pendingDetailSupplierId}?${queryParams.toString()}`);
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
  
