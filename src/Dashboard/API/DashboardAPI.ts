import { DashboardResponseDTO } from "../Types/DashboardTypes";
import { BASE_URL_APIS_CORE } from "../../constants";

const URL: string = `${BASE_URL_APIS_CORE}/dashboard`;

export const getDashboardMetrics = async (): Promise<DashboardResponseDTO | null> => {
    try {
        const response = await fetch(`${URL}/metrics`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status} - ${response.statusText}`);
        }

        const data: DashboardResponseDTO = await response.json();
        return data;
    } catch (error) {
        console.error("Error al llamar a la API de dashboard:", error);
        throw error; 
    }
};