import { ObjectResponse } from "../Types/TypesDTO/ObjectResponse";
import { Warehouse } from "../Types/WarehouseTypes"; // Define el tipo de datos para Warehouse
import { BASE_URL_APIS_CORE } from "../../constants";

// Define la URL base para la API de Warehouse y la URL específica para los tipos de bodega
const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/warehouse`;

export async function GetWarehouseById(
  id: number
): Promise<ObjectResponse<Warehouse> | null> {
  try {
    const response = await fetch(`${URL}/get/${id}`);
    if (response.ok) {
      const data: ObjectResponse<Warehouse> = await response.json();
      return data;
    } else {
      throw new Error(
        `La solicitud a la API falló con estado ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
  }
}

// Obtener warehouses con paginación, orden y filtros
export const GetWarehouses = async (
  page: number,
  size: number,
  filters: Partial<Warehouse>,
  sortOrder: string = "ASC",
  sortBy?: keyof Warehouse
): Promise<Warehouse[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", String(page));
  queryParams.append("size", String(size));
  queryParams.append(
    "orders",
    sortOrder === "ASC" || sortOrder === "DESC" ? sortOrder : "ASC"
  );

  if (sortBy) {
    queryParams.append("sortBy", String(sortBy));
  }

  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof Warehouse];
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
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

// Crear un nuevo warehouse
export async function CreateWarehouse(warehouseDto: Warehouse): Promise<void> {
  try {
    const response = await fetch(`${URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(warehouseDto),
    });
    if (!response.ok) {
      throw new Error(
        `La solicitud a la API falló con estado ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Buscar warehouses con filtros avanzados
export const GetSearchWarehouses = async (
  page: number,
  size: number,
  filters: Partial<Warehouse>,
  sortOrder: string = "ASC",
  sortBy?: keyof Warehouse
): Promise<Warehouse[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", String(page));
  queryParams.append("size", String(size));
  queryParams.append("orders", sortOrder);

  if (sortBy) queryParams.append("sortBy", String(sortBy));

  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof Warehouse];
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
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

// Actualizar un warehouse existente
export async function UpdateWarehouse(
  id: number,
  warehouseDto: Warehouse
): Promise<void> {
  try {
    const response = await fetch(`${URL}/update/${id}`, {
      method: "POST", // Se utiliza POST ya que el endpoint Java se configuró así
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(warehouseDto),
    });
    if (!response.ok) {
      throw new Error(
        `La solicitud a la API falló con estado ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Eliminar (inactivar) un warehouse
export async function DeleteWarehouse(id: number): Promise<void> {
  try {
    const response = await fetch(`${URL}/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(
        `La solicitud a la API falló con estado ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
  }
}

// Obtener todos los warehouses sin paginación
export async function GetAllWarehousesNoPage(): Promise<Warehouse[] | null> {
  try {
    const response = await fetch(`${URL}/no-page/getAllWarehouses`);
    if (response.ok) {
      const data: Warehouse[] = await response.json();
      return data;
    } else {
      throw new Error(
        `La solicitud a la API falló con estado ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error al obtener los almacenes:", error);
    return null;
  }
}
