import {InventoryHistoryTypes } from "../Types/InventoryHistoryTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

const URL: string = `${BASE_URL_APIS_CORE}/transaction`;

export const GetInventoryHistory = async (
  page: number,
  size: number,
  filters: Partial<InventoryHistoryTypes>,
  sortOrder: string = '',  
  sortBy?: keyof InventoryHistoryTypes,
  startDate?: string,  // 🔥 NUEVO
  endDate?: string     // 🔥 NUEVO
): Promise<InventoryHistoryTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy)); 
  }

  // 🔥 AGREGAR FECHAS SI EXISTEN
  if (startDate) {
    queryParams.append('startDate', startDate);
  }
  if (endDate) {
    queryParams.append('endDate', endDate);
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof InventoryHistoryTypes];
    if (value) {
      queryParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(`${URL}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    const data = await response.json();
    return data.content; 
  } catch (error) {
    console.error('Error al obtener los elementos:', error);
   throw error;
  }
};

export const GetSearchInventoryHistory = async (
  page: number,
  size: number,
  filters: Partial<InventoryHistoryTypes>,
  sortOrder: string = 'ASC',  
  sortBy?: keyof InventoryHistoryTypes,
  startDate?: string,  // 🔥 NUEVO
  endDate?: string     // 🔥 NUEVO
): Promise<InventoryHistoryTypes[]> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', String(page));
  queryParams.append('size', String(size));

  const validSortOrder = sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC';
  queryParams.append('orders', validSortOrder);

  if (sortBy) {
    queryParams.append('sortBy', String(sortBy));
  }

  // 🔥 AGREGAR FECHAS SI EXISTEN
  if (startDate) {
    queryParams.append('startDate', startDate);
  }
  if (endDate) {
    queryParams.append('endDate', endDate);
  }

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof InventoryHistoryTypes];
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
    throw error;
  }
};