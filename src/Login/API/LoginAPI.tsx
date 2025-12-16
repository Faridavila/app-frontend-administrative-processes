import { BASE_URL_APIS_USER } from "../../constants";

//const URL = 'http://localhost:8081/api/v1/back-user-service/user'; 
const URL: string = `${BASE_URL_APIS_USER}/user`;


export const login = async (username: string, password: string) => {
    const loginData = {
        username: username,
        password: password,
        loginMode: "GGP_LOGIN",
    };

    try {
        const response = await fetch(`${URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (response.ok) {
            const data = await response.json();
            return data; 
        } else {
            throw new Error('Error en la autenticación');
        }
    } catch (error) {
        console.error('Error al hacer login:', error);
        return null;
    }
};


export const getUserData = async () => {
    try {
        const token = localStorage.getItem('jwt_token');
        if (!token) throw new Error('Token no encontrado');

        const response = await fetch(`${URL}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Error al obtener los datos del usuario');
        }
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        return null;
    }
};
