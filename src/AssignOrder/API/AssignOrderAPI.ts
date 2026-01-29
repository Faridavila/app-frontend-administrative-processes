import { AssignOrderTypes } from "../Types/AssignOrderTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

const URL: string = `${BASE_URL_APIS_CORE}/order-allocation`;

// Función auxiliar para mapear del backend al frontend
const mapBackendToFrontend = (backendData: any): AssignOrderTypes => {
  return {
    id: backendData.id,
    userId: backendData.transporterId || backendData.userId,
    userName: backendData.transporterName || backendData.userName || "",
    warehouseId: backendData.originWarehouseId || backendData.warehouseId,
    warehouseName: backendData.warehouseName || "",
    neighborhoodRateId: backendData.destinationNeighborhoodId || backendData.neighborhoodRateId,
    neighborhoodName: backendData.neighborhoodName || "",
    address: backendData.address || "",
    orderId: backendData.pendingOrderId || backendData.orderId,
    customerName: backendData.customerName || "",
    customerAddress: backendData.address || backendData.customerAddress || "",
    customerCity: backendData.customerCity || "",
    customerPhone: backendData.phone || backendData.customerPhone || "",
    totalPurchase: backendData.total || backendData.totalAmount || backendData.totalPurchase || 0,
    paymentMethodId: backendData.paymentMethodId || 0,
    paymentMethodName: backendData.paymentMethodName || "",
    date: backendData.date ? backendData.date.toString() : "",
    hour: backendData.hour ? backendData.hour.toString() : "",
    observation: backendData.observations || backendData.observation || "",
    statusOrder: backendData.statusOrderAllocation || backendData.statusOrder || "",
    status: backendData.status || "",
    chargeInvoice: backendData.chargeInvoice || false,
    products: (backendData.products || []).map((p: any) => ({
      id: p.productId || p.id,
      productName: p.productName || "",
      quantity: p.quantity || 0,
      quantityPerTrip: p.assignedQuantity || p.quantityPerTrip || 0,
      price: p.unitPrice || p.price || 0,
      total: p.total || 0,
      pendingOrderDetailId: p.pendingOrderDetailId || p.id,
    })),
  };
};

export const GetAssignOrder = async (
  page: number,
  size: number,
  filters: Partial<AssignOrderTypes>,
  sortOrder: string = '',
  sortBy?: keyof AssignOrderTypes
): Promise<AssignOrderTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof AssignOrderTypes];
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  try {
    console.log("🔍 Llamando a GetAssignOrder:", `${URL}?${queryParams.toString()}`);
    
    const response = await fetch(`${URL}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    const data = await response.json();
    
    console.log("📥 Datos recibidos del backend:", data);
    
    // Mapear los datos del backend al formato del frontend
    const mappedData = (data.content || []).map(mapBackendToFrontend);
    
    console.log("✅ Datos mapeados:", mappedData);
    
    return mappedData;
  } catch (error) {
    console.error('❌ Error al obtener los elementos:', error);
    return [];
  }
};

export async function CreateAssignOrder(
  assignOrderDto: AssignOrderTypes,
  imageFile: File | null
): Promise<void> {
  try {
    console.log("📤 Datos a enviar (sin mapeo):", assignOrderDto);

    const response = await fetch(`${URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assignOrderDto),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error del servidor:", errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Orden de asignación creada:", data);
  } catch (error) {
    console.error("❌ Error al crear la orden de asignación:", error);
    throw error;
  }
}

export const GetSearchAssignOrder = async (
  page: number,
  size: number,
  filters: Partial<AssignOrderTypes>,
  sortOrder: string = 'ASC',
  sortBy?: keyof AssignOrderTypes
): Promise<AssignOrderTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof AssignOrderTypes];
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  try {
    console.log("🔍 Buscando con filtros:", `${URL}/search?${queryParams.toString()}`);
    
    const response = await fetch(`${URL}/search?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    const data = await response.json();
    
    console.log("📥 Resultados de búsqueda:", data);
    
    // Mapear los datos del backend al formato del frontend
    const mappedData = (data.content || []).map(mapBackendToFrontend);
    
    return mappedData;
  } catch (error) {
    console.error('❌ Error al buscar:', error);
    return [];
  }
};

export async function UpdateAssignOrder(
  id: number,
  assignOrderDto: AssignOrderTypes,
  imageFile: File | null
): Promise<void> {
  try {
    console.log("📤 Datos a actualizar (sin mapeo):", assignOrderDto);

    const response = await fetch(`${URL}/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assignOrderDto),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error del servidor:", errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Orden de asignación actualizada:", data);
  } catch (error) {
    console.error("❌ Error al actualizar la orden de asignación:", error);
    throw error;
  }
}

export async function DeleteAssignOrder(id: number): Promise<void> {
  try {
    const response = await fetch(`${URL}/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al eliminar: ${response.status} - ${errorText}`);
    }
    console.log("✅ Orden de asignación eliminada");
  } catch (error) {
    console.error("❌ Error al eliminar la orden de asignación:", error);
    throw error;
  }
}

export async function GetAllAssignOrderNoPage(): Promise<AssignOrderTypes[] | null> {
  try {
    const response = await fetch(`${URL}/no-page/getAllOrderAllocations`);
    if (response.ok) {
      const data = await response.json();
      const mappedData = data.map(mapBackendToFrontend);
      return mappedData;
    } else {
      throw new Error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error("Error al obtener todas las órdenes:", error);
    return null;
  }
}