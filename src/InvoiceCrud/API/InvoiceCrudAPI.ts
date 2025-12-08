// src/Invoice/API/InvoiceCrudAPI.ts
import { InvoiceCrudTypes } from "../Types/InvoiceCrudTypes";

// MOCK DE FACTURAS CON TODOS LOS DETALLES REALES (para que se vea perfecto)
const mockDetailedInvoices: Record<number, any> = {
  1001: {
    id: 1001,
    invoiceNumber: "FAC-1001",
    date: "2025-12-03T14:30:00",
    customerName: "Fandi Dallang Avila Piedrahita",
    customerIdentification: "23-23-23",
    customerPhone: "3182528946",
    customerAddress: "Cra 5 sur # 8-95, Casa",
    customerCity: "Bogotá",
    cashierName: "María López",
    paymentMethodName: "Efectivo",
    deliveryType: "llevar",
    deliveryCost: 3423,
    paymentType: "abono",
    initialPayment: 3233,
    remainingBalance: 1140,
    observations: "Notas adicionales...",

    details: [
      {
        productName: "Ladrillo limpio 10 hueco",
        quantity: 1,
        unitPrice: 950,
        totalDiscount: 0,
        total: 950
      }
    ],

    subtotal: 950,
    totalDiscount: 0,
    total: 4373
  },

  1002: {
    id: 1002,
    invoiceNumber: "FAC-1002",
    date: "2025-12-02T09:15:00",
    customerName: "Distribuidora El Sol S.A.S",
    customerIdentification: "900123456-7",
    customerPhone: "6012345678",
    customerAddress: "Av. Principal #100",
    customerCity: "Cali",
    cashierName: "Carlos Ramírez",
    paymentMethodName: "Transferencia",
    deliveryType: "llevar",
    deliveryCost: 80000,
    paymentType: "credito",
    dueDate: "2025-12-30",
    observations: "Pago a 30 días. Cliente preferencial.",

    details: [
      {
        productName: "Cemento gris x50 sacos",
        quantity: 50,
        unitPrice: 25000,
        totalDiscount: 125000,
        total: 1125000
      }
    ],

    subtotal: 1250000,
    totalDiscount: 125000,
    total: 1330000
  },

  1003: {
    id: 1003,
    invoiceNumber: "FAC-1003",
    date: "2025-12-01T16:45:00",
    customerName: "Ana María Rodríguez",
    customerIdentification: "987654321",
    customerPhone: "3109876543",
    customerAddress: "Carrera 7 #89-10",
    customerCity: "Medellín",
    cashierName: "María López",
    paymentMethodName: "Tarjeta Crédito",
    deliveryType: "recoger",
    deliveryCost: 0,
    paymentType: "contado",
    observations: "Cliente frecuente.",

    details: [
      {
        productName: "Varilla corrugada 12mm x20",
        quantity: 20,
        unitPrice: 45000,
        totalDiscount: 90000,
        total: 810000
      }
    ],

    subtotal: 900000,
    totalDiscount: 90000,
    total: 810000
  }
};

// LISTADO PARA LA TABLA
export const mockInvoices: InvoiceCrudTypes[] = [
  { id: 1001, customerId: 45, customerName: "Fandi Dallang Avila Piedrahita", cashierName: "María López", paymentMethodName: "Efectivo", totalPurchase: 4373, date: "2025-12-03T14:30:00", statusOrder: "Cargado", status: "Cargado" },
  { id: 1002, customerId: 78, customerName: "Distribuidora El Sol S.A.S", cashierName: "Carlos Ramírez", paymentMethodName: "Transferencia", totalPurchase: 1330000, date: "2025-12-02T09:15:00", statusOrder: "Pendiente", status: "Pendiente" },
  { id: 1003, customerId: 12, customerName: "Ana María Rodríguez", cashierName: "María López", paymentMethodName: "Tarjeta Crédito", totalPurchase: 810000, date: "2025-12-01T16:45:00", statusOrder: "Cargado", status: "Cargado" }
];

// FUNCIÓN PARA EL DETALLE (usa el mock detallado)
export async function GetGenerateInvoiceById(id: number): Promise<any> {
  await new Promise(r => setTimeout(r, 600)); // simula delay
  console.log("Buscando factura con ID:", id);
  const invoice = mockDetailedInvoices[id];
  if (!invoice) {
    console.warn("Factura no encontrada en mock:", id);
    return null;
  }
  return invoice;
}

// FUNCIÓN PARA EL LISTADO
export const GetInvoiceCrud = async (): Promise<InvoiceCrudTypes[]> => {
  await new Promise(r => setTimeout(r, 800));
  return mockInvoices;
};


export async function CreateInvoiceCrud(
  InvoiceCrudDto: InvoiceCrudTypes,
  imageFile: File | null
): Promise<void> {
  try {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile); 
    }

    console.log("Data:", InvoiceCrudDto);
    const response = await fetch(`${URL}/create`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`La solicitud a la API falló ${response.status}`);
    }

    const data = await response.json();
    console.log("InvoiceCrudo creado:", data);
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;
  }
}

export async function UpdateIntorySubtract( branchDto: InvoiceCrudTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/subtract-quantity`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(branchDto),
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        throw error;  
    }
}

export async function UpdateIntoryAdd( branchDto: InvoiceCrudTypes): Promise<void> {
    try {
        const response = await fetch(`${URL}/add-quantity`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(branchDto),
        });
        if (!response.ok) {
            throw new Error(`La solicitud a la API fallo ${response.status}`);
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        throw error;  
    }
}

export const GetSearchInvoiceCrud = async (
  page: number,
  size: number,
  filters: Partial<InvoiceCrudTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof InvoiceCrudTypes 
): Promise<InvoiceCrudTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));


  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  
  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof InvoiceCrudTypes];
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




export async function UpdateInvoiceCrud(
  id: number,
  imageFile: File | null
): Promise<void> {
  try {
    const formData = new FormData();
  
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

export async function DeleteInvoiceCrud(id: number): Promise<void> {
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


export async function GetAllInvoiceCrudNoPage(): Promise<InvoiceCrudTypes[] | null> {
  try {
      const response = await fetch(`${URL}/no-page/getAllInvoiceCrud`);
      if (response.ok) {
          const data:InvoiceCrudTypes[] = await response.json();
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



