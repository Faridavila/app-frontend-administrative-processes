import {PendingOrderTypes } from "../Types/PendingOrderTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

//const URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/supplier';
const URL: string = `${BASE_URL_APIS_CORE}/pending-order`;

export const GetPendingOrder = async (
  page: number,
  size: number,
  filters: Partial<PendingOrderTypes>,
  sortOrder?: string,
  sortBy?: keyof PendingOrderTypes
): Promise<PendingOrderTypes[]> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      orders: sortOrder || "ASC",
      sortBy: sortBy ? String(sortBy) : "id",
    });

    const response = await fetch(
      `${URL}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener pedidos pendientes: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content || data || [];
  } catch (error) {
    console.error("Error en GetPendingOrder:", error);
    throw error;
  }
};

export const CreatePendingOrder = async (
  item: PendingOrderTypes,
  imageFile: File | null = null
): Promise<void> => {
  try {
    const payload = {
      billId: null,
      customerId: item.customerId,
      address: item.address,
      phone: item.phone,
      observations: item.observations || "",
      date: item.date, // Ya viene en formato "YYYY-MM-DD"
      total: item.total,
      pendingOrderDetails: item.products.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
        unitPrice: p.purchasePrice,
        total: p.total
      }))
    };

    console.log("📤 Enviando pedido pendiente:", payload);

    const response = await fetch(`${URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error del servidor:", errorText);
      throw new Error(`Error al crear pedido pendiente: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Pedido pendiente creado:", result);
  } catch (error) {
    console.error("Error en CreatePendingOrder:", error);
    throw error;
  }
};

export const UpdatePendingOrder = async (
  id: number,
  item: PendingOrderTypes,
  imageFile: File | null = null
): Promise<void> => {
  try {
    const payload = {
      address: item.address,
      phone: item.phone,
      observations: item.observations || "",
      date: item.date,
      total: item.total,
      pendingOrderDetails: item.products.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
        unitPrice: p.purchasePrice,
        total: p.total
      }))
    };

    const response = await fetch(`${URL}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar pedido pendiente: ${errorText}`);
    }
  } catch (error) {
    console.error("Error en UpdatePendingOrder:", error);
    throw error;
  }
};



export const GetSearchPendingOrder = async (
  page: number,
  size: number,
  filters: Partial<PendingOrderTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof PendingOrderTypes 
): Promise<PendingOrderTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof PendingOrderTypes];
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




export async function DeletePendingOrder(id: number): Promise<void> {
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


export async function GetAllPendingOrderNoPage(): Promise<PendingOrderTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllPendingOrder`);
      if (response.ok) {
          const data:PendingOrderTypes[] = await response.json();
          return data;
      } else {
          throw new Error(`La solicitud a la API falló ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
      return null;
  }
}

export const GetPurchasePrice = async (
  supplierId: number,
  productId: number
): Promise<number> => {
  try {
    const endpoint = `${URL}/get-purchase-price/${supplierId}/${productId}`;
    console.log(`Llamando al endpoint: ${endpoint}`); 

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data);
    const price = typeof data === 'number' ? data : parseFloat(data.toString());
    
    if (isNaN(price)) {
      throw new Error('El valor devuelto no es un número válido');
    }

    return price;
  } catch (error) {
    console.error('Error al obtener el precio de compra:', error);
    throw error; 
  }
};



