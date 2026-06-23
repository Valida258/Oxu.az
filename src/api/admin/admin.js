import { api } from "../api";

const adminLogin = async (login, password) => {
    try {
        const response = await api.post('/login', { login, password });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export { adminLogin }