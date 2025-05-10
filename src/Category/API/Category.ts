import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { CategoryTypes } from "../Types/CategoryTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

// Define la URL base para la API de Categorías
const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/category`;

// Obtener categoría por ID
export async function GetCategoryById(
  id: number
): Promise<ObjectResponse<CategoryTypes> | null> {
  try {
    const response = await fetch(`${URL}/get/${id}`);
    if (response.ok) {
      const data: ObjectResponse<CategoryTypes> = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
  }
}

// Obtener categorías sin paginación y filtros
export const GetCategory = async (
  page: number,
  size: number,
  filters: Partial<CategoryTypes>,
  sortOrder: string = "",
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
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  try {
    // Cambiando la ruta para la correcta sin paginación
    const response = await fetch(`${URL}/no-page/getAllCategories`);
    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }
    const data = await response.json();
    return data; // No se utiliza .content ya que se devuelve una lista directamente
  } catch (error) {
    console.error("Error al obtener los elementos:", error);
    return [];
  }
};

// Crear una nueva categoría
export async function CreateCategory(
  categoryDto: CategoryTypes
): Promise<void> {
  try {
    const response = await fetch(`${URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryDto),
    });
    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Buscar categorías con filtros
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

// Actualizar una categoría existente
export async function UpdateCategory(
  id: number,
  categoryDto: CategoryTypes
): Promise<void> {
  try {
    const response = await fetch(`${URL}/update/${id}`, {
      method: "PUT", // Cambiado de POST a PUT para actualización
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryDto),
    });
    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Eliminar una categoría
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
  }
}

// Obtener todas las categorías sin paginación
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
