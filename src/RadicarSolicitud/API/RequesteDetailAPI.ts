import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { RequestDetailTypes } from "../Types/RequestDetailTypes"; // Define el tipo de datos para RequestDetails
import { BASE_URL_APIS_CORE } from "../../constants";
import Swal from "sweetalert2";

// Define la URL base para la API de RequestDetails
const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/request-details`;

// Obtener detalles de solicitud por ID
export async function GetRequestDetailById(
  id: number
): Promise<ObjectResponse<RequestDetailTypes> | null> {
  try {
    const response = await fetch(`${URL}/get/${id}`);
    if (response.ok) {
      const data: ObjectResponse<RequestDetailTypes> = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
  }
}

// Obtener detalles de solicitud con paginación y filtros
export const GetRequestDetails = async (
  page: number,
  size: number,
  filters: Partial<RequestDetailTypes>,
  sortOrder: string = "",
  sortBy?: keyof RequestDetailTypes
): Promise<RequestDetailTypes[]> => {
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
    const value = filters[key as keyof RequestDetailTypes];
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
    console.error("Error al obtener los detalles de solicitud:", error);
    return [];
  }
};

// **Buscar detalles de solicitud con filtros**
export const GetSearchRequestDetails = async (
  page: number,
  size: number,
  filters: Partial<RequestDetailTypes>,
  sortOrder: string = "ASC",
  sortBy?: keyof RequestDetailTypes
): Promise<RequestDetailTypes[]> => {
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
    const value = filters[key as keyof RequestDetailTypes];
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
    console.error("Error al buscar los detalles de solicitud:", error);
    return [];
  }
};
// Crear un nuevo detalle de solicitud
export async function CreateRequestDetail(
  requestDetailDto: RequestDetailTypes
): Promise<void> {
  try {
    const response = await fetch(`${URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestDetailDto),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.message.includes("foreign key")) {
          throw new Error(
            "El ID de la solicitud no existe. Por favor, verifique el ID de la solicitud."
          );
        }
      }
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error al llamar a la API:", errorMessage);

    Swal.fire({
      icon: "error",
      title: "Error al crear detalle",
      text:
        errorMessage || "Hubo un error al crear el detalle de la solicitud.",
      confirmButtonText: "Aceptar",
    });
  }
}

// Actualizar un detalle de solicitud existente
export async function UpdateRequestDetail(
  id: number,
  requestDetailDto: RequestDetailTypes
): Promise<void> {
  try {
    const response = await fetch(`${URL}/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestDetailDto),
    });
    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Eliminar un detalle de solicitud
export async function DeleteRequestDetail(id: number): Promise<void> {
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

// Obtener todos los detalles de solicitud sin paginación
export async function GetAllRequestDetailsNoPage(): Promise<
  RequestDetailTypes[] | null
> {
  try {
    const response = await fetch(`${URL}/no-page/getAllRequestDetails`);
    if (response.ok) {
      const data: RequestDetailTypes[] = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
  }
}
