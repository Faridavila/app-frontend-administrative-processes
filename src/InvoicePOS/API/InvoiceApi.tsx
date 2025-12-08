import { GenerateInvoiceType } from "../Types/GenerateInvoice";
import {BASE_URL_APIS_CORE} from "../../constants/index";

//const API_URL = 'http://localhost:8080/api/v1/back-app-catalog-core-service/invoice';
const API_URL: string = `${BASE_URL_APIS_CORE}/invoice`;

export const GetGenerateInvoice = async (): Promise<GenerateInvoiceType> => {
  const response = await fetch(`${API_URL}/all`);
  if (!response.ok) {
    throw new Error(`La solicitud a la API fallo: ${response.statusText}`);
  }
  const data: GenerateInvoiceType = await response.json(); 
  return data;
};




export async function GetGenerateInvoiceById(id: number): Promise<GenerateInvoiceType | null> {
  try {
    const response = await fetch(`${API_URL}/get/${1}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`Error al cargar el ID de Invoice ${id}: ${response.status} - ${await response.text()}`);
      return null;  
    }
  } catch (error) {
    console.error(`Error en el ID ${id}:`, error);
    return null;  
  }
}



export const UpdateGenerateInvoice = async (Invoice: GenerateInvoiceType): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/update/${1}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Invoice),
    });

    return response.ok; 
  } catch (error) {
    console.error("Error al actualizar Invoice:", error);
    return false; 
  }
};



export const GetInvoiceCRUD= async (
page: number,
size: number,
filters: Partial<GenerateInvoiceType>,
sortOrder: string = '',  
sortBy?: keyof GenerateInvoiceType
): Promise<GenerateInvoiceType[]> => {
const queryParams = new URLSearchParams();

queryParams.append('page', String(page));
queryParams.append('size', String(size));

const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
queryParams.append('orders', validSortOrder);

if (sortBy) {
  queryParams.append('sortBy', String(sortBy)); 
}

Object.keys(filters).forEach(key => {
  const value = filters[key as keyof GenerateInvoiceType];
  if (value) {
    queryParams.append(key, String(value));
  }
});

try {
  const response = await fetch(`${API_URL}?${queryParams.toString()}`);
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

export async function CreateInvoiceCRUD(branchDto: GenerateInvoiceType) {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(branchDto),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Error al llamar a la API:", errorMessage);
      throw new Error(`La solicitud a la API falló ${response.status}: ${errorMessage}`);
    }

    const responseData = await response.json();
    console.log("Respuesta de la API:", responseData);  
    return responseData;  
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;  
  }
}



export const GetSearchInvoiceCRUD = async (
page: number,
size: number,
filters: Partial<GenerateInvoiceType>,
sortOrder: string = 'ASC',  
sortBy?: keyof GenerateInvoiceType 
): Promise<GenerateInvoiceType[]> => {
const queryParams = new URLSearchParams();

queryParams.append('page', String(page));
queryParams.append('size', String(size));


const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
queryParams.append('orders', validSortOrder);

if (sortBy) {
  queryParams.append('sortBy', String(sortBy));
}


Object.keys(filters).forEach(key => {
  const value = filters[key as keyof GenerateInvoiceType];
  if (value !== undefined && value !== null && value !== '') {
    queryParams.append(key, String(value));
  }
});

try {
  const response = await fetch(`${API_URL}/search?${queryParams.toString()}`);
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





export async function UpdateInvoiceCRUD(id: number, branchDto: GenerateInvoiceType): Promise<void> {
  try {
      const response = await fetch(`${API_URL}/update/${id}`, {
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
  }
}


export async function DeleteInvoiceCRUD(id: number): Promise<void> {
  try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
          method: "DELETE",
      });
      if (!response.ok) {
          throw new Error(`La solicitud a la API fallo ${response.status}`);
      }
  } catch (error) {
      console.error("Error al llamar a la API:", error);
  }
}


export async function GetAllGenerateInvoiceNoPage(): Promise<GenerateInvoiceType[] | null> {
try {
    const response = await fetch(`${API_URL}/no-page`);
    if (response.ok) {
        const data: GenerateInvoiceType[] = await response.json();
        return data;
    } else {
        throw new Error(`La solicitud a la API falló ${response.status}`);
    }
} catch (error) {
    console.error("Error al llamar a la API:", error);
    return null;
}

}

export const saveProduct = async (invoiceId: number, productId: number, quantity: number) => {
  const productData = {
    invoiceId,
    productId, 
    quantity,  
  };

  try {
    const response = await fetch(`${API_URL}/saveProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData), 
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`La solicitud a la API falló: ${errorMessage}`);
    }

    const data = await response.json();
    console.log("Producto guardado con éxito:", data);
    return data; 
  } catch (error) {
    console.error("Error al guardar el producto:", error);
    return null; 
  }
};


export const deleteProductFromInvoice = async (invoiceId: number, productId: number) => {
  const deleteProduct = {
    invoiceId,
    productId, 
  };

  try {
    const response = await fetch(`${API_URL}/delete-product`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(deleteProduct), 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al eliminar el producto: ${errorText}`);
    }

    console.log(`✅ Producto eliminado con éxito (ID: ${productId}) de la factura ${invoiceId}`);
    return true; 
  } catch (error) {
    console.error("❌ Error al eliminar el producto:", error);
    return false; 
  }
};


export const saveInvoice = async (id: number, customerId: number, sellerId: number) => {
  const invoiceData = {
    id,
    customerId,
    sellerId,
  };

  try {
    const response = await fetch(`${API_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData), 
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`La solicitud a la API falló: ${errorMessage}`);
    }

    const data = await response.json();
    console.log("Factura guardada con éxito:", data);
    return data; 
  } catch (error) {
    console.error("Error al guardar la factura:", error);
    return false; 
  }
};
