import { CategoryTypes } from "../Types/CategoryTypes";
import { BASE_URL_APIS_CORE } from "../../constants";


//const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/category`;
const URL: string = `http://localhost:8080/api/v1/back-app-catalog-core-service/category`;


export const GetCategory = async (
  page: number,
  size: number,
  filters: Partial<CategoryTypes>,
  sortOrder: string = '',  
  sortBy?: keyof CategoryTypes
): Promise<CategoryTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof CategoryTypes];
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


export async function CreateCategory(
  categoryDto: CategoryTypes,
  imageFile: File | null
): Promise<void> {
  try {
    const formData = new FormData();
    
    formData.append("nameCategory", categoryDto.nameCategory);
    formData.append("soldOutValue", categoryDto.soldOutValue);
    formData.append("fewUnits", categoryDto.fewUnits);

    if (imageFile) {
      formData.append("image", imageFile); 
    }

    const response = await fetch(`${URL}/create`, {
      method: "POST",
      body: formData, 
    });

    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }

    const data = await response.json();
    console.log("Categoría creada:", data);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;
  }
}


export const GetSearchCategory = async (
  page: number,
  size: number,
  filters: Partial<CategoryTypes>,
  sortOrder: string = "ASC",
  sortBy?: keyof CategoryTypes
): Promise<CategoryTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", String(page));
  queryParams.append("size", String(size));

  const validSortOrder =
    sortOrder === "ASC" || sortOrder === "DESC" ? sortOrder : "ASC";
  queryParams.append("orders", validSortOrder);

  if (sortBy) {
    queryParams.append("sortBy", String(sortBy));
  }

  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof CategoryTypes];
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}/search?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error al obtener los elementos:", error);
    return [];
  }
};


export async function UpdateCategory(
  id: number,
  categoryDto: CategoryTypes,
  imageFile: File | null
): Promise<void> {
  try {
    const formData = new FormData();
    
   formData.append("nameCategory", categoryDto.nameCategory);
   formData.append("soldOutValue", categoryDto.soldOutValue);
   formData.append("fewUnits", categoryDto.fewUnits);

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

export async function DeleteCategory(id: number): Promise<void> {
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


export async function GetAllCategoryNoPage(): Promise<CategoryTypes[]> {
  try {
    const response = await fetch(`${URL}/no-page/getAllCategories`);
    if (response.ok) {
      const data: CategoryTypes[] = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return [];
  }
}
