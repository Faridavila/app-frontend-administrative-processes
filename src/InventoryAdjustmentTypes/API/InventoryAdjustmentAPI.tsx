import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { InventoryAdjustmentTypes } from "../Types/InventoryAdjustmentTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/inventory-adjustment`;

// Obtener un Inventory Adjustment por ID
export async function GetInventoryAdjustmentId(
  id: number
): Promise<ObjectResponse<InventoryAdjustmentTypes> | null> {
  try {
    const response = await fetch(`${URL}/get/${id}`);
    if (response.ok) {
      const data: ObjectResponse<InventoryAdjustmentTypes> =
        await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
  }
}

// Obtener Inventory Adjustments con paginación y filtros
export const GetInventoryAdjustments = async (
  page: number,
  size: number,
  filters: Partial<InventoryAdjustmentTypes>,
  sortOrder: string = "ASC",
  sortBy?: keyof InventoryAdjustmentTypes
): Promise<InventoryAdjustmentTypes[]> => {
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
    const value = filters[key as keyof InventoryAdjustmentTypes];
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

// Crear un nuevo Inventory Adjustment
export async function CreateInventoryAdjustment(
  adjustmentDto: InventoryAdjustmentTypes
): Promise<void> {
  try {
    const response = await fetch(`${URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adjustmentDto),
    });
    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Buscar Inventory Adjustments con filtros
export const GetSearchInventoryAdjustment = async (
  page: number,
  size: number,
  filters: Partial<InventoryAdjustmentTypes>,
  sortOrder: string = "ASC",
  sortBy?: keyof InventoryAdjustmentTypes
): Promise<InventoryAdjustmentTypes[]> => {
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
    const value = filters[key as keyof InventoryAdjustmentTypes];
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

// Actualizar un Inventory Adjustment existente
export async function UpdateInventoryAdjustment(
  id: number,
  adjustmentDto: InventoryAdjustmentTypes
): Promise<void> {
  try {
    const response = await fetch(`${URL}/update/${id}`, {
      method: "PUT", // Cambiado a PUT para mantener consistencia
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adjustmentDto),
    });
    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Eliminar un Inventory Adjustment
export async function DeleteInventoryAdjustment(id: number): Promise<void> {
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

// Obtener todos los Inventory Adjustments sin paginación
export async function GetAllInventoryAdjustmentsNoPage(): Promise<
  InventoryAdjustmentTypes[] | null
> {
  try {
    const response = await fetch(`${URL}/no-page/getAllInventoryAdjustments`);
    if (response.ok) {
      const data: InventoryAdjustmentTypes[] = await response.json();
      return data;
    } else {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
  }
}
