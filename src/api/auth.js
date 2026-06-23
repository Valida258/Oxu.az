import { api } from "./api";

export async function loginAdmin({ login, password }) {
    try {
        const res = await api.post("/login", { login, password })
        console.log(res.data)
        return res.data
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function verifyAdmin() {
    try {
        const res = await api.get("/verify")
        return res.data
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export function getToken() {
    return localStorage.getItem("token")
}


export function saveToken(token) {
    localStorage.setItem("token", token)
}


export function logoutAdmin() {
    localStorage.removeItem("token")
}