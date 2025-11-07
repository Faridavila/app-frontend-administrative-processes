import { ProductPendingDetailSupplierTypes,GetProductParams } from "../Types/ProductPendingDetailSupplierTypes";
import { BASE_URL_APIS_WORKFLOW } from "../../constants";

const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/supplier';
//const URL: string = `${BASE_URL_APIS_WORKFLOW}/api/v1/back-user-service/supplier`;

export const GetProductPendingDetailSupplier = async (
  page: number,
  size: number,
  filters: Partial<ProductPendingDetailSupplierTypes>,
  sortOrder: string = '',
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
    const supplierId = extraParams?.supplierId;
  
    if (!supplierId || supplierId === 0) {
      console.error("supplierId no está definido o es inválido. Verifica extraParams");
      return [];
    }

    const apiUrl = `${URL}/getAllProductsBySupplier/${supplierId}?${queryParams.toString()}`;
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


export async function CreateProductPendingDetailSupplier(
  branchDto: ProductPendingDetailSupplierTypes, 
  imageFile: File | null,
  extraParams?: GetProductParams
): Promise<void> {
  const supplierId = extraParams?.supplierId;
  if (!supplierId || supplierId <= 0) {
    console.error("supplierId no está definido o es inválido. Verifica extraParams");
    throw new Error("supplierId es requerido para crear el producto del proveedor");
  }
  try {
    const requestBody = {
      productId: branchDto.productId,
    };
    const response = await fetch(`${URL}/addProductsBySupplier/${supplierId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`La solicitud a la API falló ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;
  }
}
export const GetSearchProductPendingDetailSupplier = async (
  page: number,
  size: number,
  filters: Partial<ProductPendingDetailSupplierTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof ProductPendingDetailSupplierTypes 
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


export async function UpdateProductPendingDetailSupplier(
  id: number,
  branchDto: ProductPendingDetailSupplierTypes,
  imageFile: File | null,
  extraParams?: GetProductParams
): Promise<void> {
  const supplierId = extraParams?.supplierId;
  if (!supplierId || supplierId <= 0) {
    console.error("supplierId no está definido o es inválido. Verifica extraParams");
    throw new Error("supplierId es requerido para actualizar el producto del proveedor");
  }
  try {
    const requestBody = {
      productId: branchDto.productId,
    };
    const response = await fetch(`${URL}/updateProductsBySupplier/${supplierId}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`La solicitud a la API falló ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;
  }
}


export async function DeleteProductPendingDetailSupplier(id: number): Promise<void> {
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


export async function GetAllProductPendingDetailSupplierNoPage(): Promise<ProductPendingDetailSupplierTypes[] | null> {
  try {
      const response = await fetch(`${URL}/get-all-without-page`);
      if (response.ok) {
          const data: ProductPendingDetailSupplierTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}



