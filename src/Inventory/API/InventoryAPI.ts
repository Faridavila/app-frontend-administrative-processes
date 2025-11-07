import {ProductTypes,ProductQuantityBatch } from "../Types/InventoryTypes";
//import { BASE_URL_APIS_CORE } from "../../constants";

const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/product';
//const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/cash-register`;

export const GetProduct = async (
  page: number,
  size: number,
  filters: Partial<ProductTypes>,
  sortOrder: string = '',  
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


export async function CreateProduct(
  ProductDto: ProductTypes,
  imageFile: File | null
): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("productName", ProductDto.productName);
    formData.append("price", String(Number(ProductDto.price)));
    formData.append("description", ProductDto.description); 
    formData.append("categoryId", String(Number(ProductDto.categoryId))); 
    formData.append("quantity", String(Number(ProductDto.quantity)));

    if (imageFile) {
      formData.append("image", imageFile); 
    }

    console.log("Data:", ProductDto);
    const response = await fetch(`${URL}/create`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }

    const data = await response.json();
    console.log("Producto creado:", data);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;
  }
}

export async function UpdateIntoryAdd(batchData: ProductQuantityBatch): Promise<void> {
  try {
    const response = await fetch(`${URL}/add-quantity`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchData), 
    });
    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;
  }
}

export async function UpdateIntorySubtract(batchData: ProductQuantityBatch): Promise<void> {
  try {
    const response = await fetch(`${URL}/subtract-quantity`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchData),  
    });
    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;
  }
}

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
      throw new Error('Error en la respuesta del servidor');
    }
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error al obtener los elementos:', error);
    return [];
  }
};


export async function UpdateProduct(
  id: number,
  ProductDto: ProductTypes,
  imageFile: File | null
): Promise<void> {
  try {
    const formData = new FormData();
    
    formData.append("productName", ProductDto.productName);
    formData.append("price", String(Number(ProductDto.price)));
    formData.append("description", ProductDto.description); 
    formData.append("categoryId", String(Number(ProductDto.categoryId))); 
    formData.append("quantity", String(Number(ProductDto.quantity)));

    if (imageFile) {
      formData.append("image", imageFile); 
    }
    const response = await fetch(`${URL}/update/${id}`, {
      method: "PUT",
      body: formData, 
    });

    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }

    const data = await response.json();
    console.log("Categoría actualizada:", data);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;  
  }
}

export async function DeleteProduct(id: number): Promise<void> {
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


export async function GetAllProductNoPage(): Promise<ProductTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllProduct`);
      if (response.ok) {
          const data:ProductTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}



