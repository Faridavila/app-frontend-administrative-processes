import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { WarehouseTypes } from "../Types/WarehouseTTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/warehouse-type`;

// Obtener un WarehouseType por ID
export async function GetWarehouseTypeById(
  id: number
): Promise<ObjectResponse<WarehouseTypes> | null> {
  try {
    const response = await fetch(`${URL}/get/${id}`);
    if (response.ok) {
      const data: ObjectResponse<WarehouseTypes> = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
  }
}

// Obtener WarehouseTypes con paginación y filtros
export const GetWarehouseTypes = async (
  page: number,
  size: number,
  filters: Partial<WarehouseTypes>,
  sortOrder: string = "ASC",
  sortBy?: keyof WarehouseTypes
): Promise<WarehouseTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", String(page));
  queryParams.append("size", String(size));

  const validSortOrder =
    sortOrder === "ASC" || sortOrder === "DESC" ? sortOrder : "ASC";
  queryParams.append("orders", validSortOrder);

  if (sortBy) queryParams.append("sortBy", String(sortBy));

  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof WarehouseTypes];
    if (value) queryParams.append(key, String(value));
  });

  try {
    const response = await fetch(`${URL}?${queryParams.toString()}`);
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error al obtener los elementos:", error);
    return [];
  }
};

// Crear un nuevo WarehouseType
export async function CreateWarehouseType(
  warehouseDto: WarehouseTypes
): Promise<void> {
  try {
    const response = await fetch(`${URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(warehouseDto),
    });
    if (!response.ok)
      throw new Error(`La solicitud a la API falló ${response.status}`);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Buscar WarehouseTypes con filtros y paginación
export const GetSearchWarehouseTypes = async (
  page: number,
  size: number,
  filters: Partial<WarehouseTypes>,
  sortOrder: string = "ASC",
  sortBy?: keyof WarehouseTypes
): Promise<WarehouseTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", String(page));
  queryParams.append("size", String(size));

  const validSortOrder =
    sortOrder === "ASC" || sortOrder === "DESC" ? sortOrder : "ASC";
  queryParams.append("orders", validSortOrder);

  if (sortBy) queryParams.append("sortBy", String(sortBy));

  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof WarehouseTypes];
    if (value) queryParams.append(key, String(value));
  });

  try {
    const response = await fetch(`${URL}/search?${queryParams.toString()}`);
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error al obtener los elementos:", error);
    return [];
  }
};

// Actualizar un WarehouseType existente
export async function UpdateWarehouseType(
  id: number,
  warehouseDto: WarehouseTypes
): Promise<void> {
  try {
    // Asegúrate de que el campo 'status' esté presente en el cuerpo de la solicitud
    const bodyData = JSON.stringify({
      ...warehouseDto,
      status: warehouseDto.status || "ACTIVE", // Valor predeterminado si falta el status
    });

    const response = await fetch(`${URL}/update/${id}`, {
      method: "POST", // Asegúrate de que el backend acepta PUT para este endpoint
      headers: { "Content-Type": "application/json" },
      body: bodyData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `La solicitud a la API falló ${response.status}: ${errorText}`
      );
    }
  } catch (error) {
    console.error("Error al llamar a la API para actualizar:", error);
  }
}

// Eliminar un WarehouseType
export async function DeleteWarehouseType(id: number): Promise<void> {
  try {
    const response = await fetch(`${URL}/delete/${id}`, { method: "DELETE" });
    if (!response.ok)
      throw new Error(`La solicitud a la API falló ${response.status}`);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Obtener todos los WarehouseTypes sin paginación
export async function GetAllWarehouseTypesNoPage(): Promise<
  WarehouseTypes[] | null
> {
  try {
    const response = await fetch(`${URL}/no-page/getAllWarehouseTypes`);
    if (response.ok) {
      const data: WarehouseTypes[] = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
  }
}
