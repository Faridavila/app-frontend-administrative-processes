import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { ComprobanteTypes } from "../Types/VoucherTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

// Define la URL base para la API de Comprobantes
const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/comprobante`;

// Obtener comprobante por ID
export async function GetComprobanteById(
  id: number
): Promise<ObjectResponse<ComprobanteTypes> | null> {
  try {
    const response = await fetch(`${URL}/get/${id}`);
    if (response.ok) {
      const data: ObjectResponse<ComprobanteTypes> = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
  }
}

// Obtener comprobantes con paginación y filtros
export const GetComprobante = async (
  page: number,
  size: number,
  filters: Partial<ComprobanteTypes>,
  sortOrder: string = "",
  sortBy?: keyof ComprobanteTypes
): Promise<ComprobanteTypes[]> => {
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
    const value = filters[key as keyof ComprobanteTypes];
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}?${queryParams.toString()}`);
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

// Crear un nuevo comprobante
export async function CreateComprobante(
  comprobanteDto: ComprobanteTypes
): Promise<void> {
  try {
    const response = await fetch(`${URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comprobanteDto),
    });
    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Buscar comprobantes con filtros
export const GetSearchComprobante = async (
  page: number,
  size: number,
  filters: Partial<ComprobanteTypes>,
  sortOrder: string = "ASC",
  sortBy?: keyof ComprobanteTypes
): Promise<ComprobanteTypes[]> => {
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
    const value = filters[key as keyof ComprobanteTypes];
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

// Actualizar un comprobante existente
export async function UpdateComprobante(
  id: number,
  comprobanteDto: ComprobanteTypes
): Promise<void> {
  try {
    const response = await fetch(`${URL}/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comprobanteDto),
    });
    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Eliminar un comprobante
export async function DeleteComprobante(id: number): Promise<void> {
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

// Obtener todos los comprobantes sin paginación
export async function GetAllComprobanteNoPage(): Promise<ObjectResponse<
  ComprobanteTypes[]
> | null> {
  try {
    const response = await fetch(`${URL}/no-page/getAllComprobantes`);
    if (response.ok) {
      const data: ObjectResponse<ComprobanteTypes[]> = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
  }
}
