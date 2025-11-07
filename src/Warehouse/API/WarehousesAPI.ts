import { WarehouseTypes } from "../Types/WarehouseTypes"; 
import { BASE_URL_APIS_CORE } from "../../constants";


//const URL: string = `${BASE_URL_APIS_CORE}/api/v1/back-app-catalog-core-service/warehouse`;
const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/warehouse';



export const GetWarehouses = async (
  page: number,
  size: number,
  filters: Partial<WarehouseTypes>,
  sortOrder: string = "ASC",
  sortBy?: keyof WarehouseTypes
): Promise<WarehouseTypes[]> => {
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
    const value = filters[key as keyof WarehouseTypes];
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


export async function CreateWarehouse(warehouseDto: WarehouseTypes): Promise<void> {
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


export const GetSearchWarehouses = async (
  page: number,
  size: number,
  filters: Partial<WarehouseTypes>,
  sortOrder: string = "ASC",
  sortBy?: keyof WarehouseTypes
): Promise<WarehouseTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", String(page));
  queryParams.append("size", String(size));
  queryParams.append("orders", sortOrder);

  if (sortBy) queryParams.append("sortBy", String(sortBy));

  Object.keys(filters).forEach((key) => {
    const value = filters[key as keyof WarehouseTypes];
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


export async function UpdateWarehouse(
  id: number,
  warehouseDto: WarehouseTypes
): Promise<void> {
  try {
    const response = await fetch(`${URL}/update/${id}`, {
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


export async function GetAllWarehousesNoPage(): Promise<WarehouseTypes[] | null> {
  try {
    const response = await fetch(`${URL}/no-page/getAllWarehouses`);
    if (response.ok) {
      const data: WarehouseTypes[] = await response.json();
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
