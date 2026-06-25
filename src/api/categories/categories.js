import { api } from "../api";

// 1. Bütün kateqoriyaları gətir
const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// 2. Kateqoriyaya görə xəbərləri gətir
const getCategoryById = async (id) => {
    try {
        const response = await api.get(`/news_by_categ/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// 3. Yeni kateqoriya yarat
const createCategory = async (name) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await api.post('/categories', 
            { name }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// 4. Kateqoriyanı sil
const deleteCategory = async (id) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await api.delete(`/categories/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// 5. YENİ: Kateqoriyanı yenilə
const updateCategory = async (id, name) => {
    try {
        const token = localStorage.getItem("admin_token");
        const response = await api.put(`/categories/${id}`, 
            { name }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export { getCategories, getCategoryById, createCategory, deleteCategory, updateCategory };