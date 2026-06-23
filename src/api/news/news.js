import axios from 'axios';
import { api } from "../api";

export const getNews = async () => {
    const response = await api.get('/news?limit=50');
    return response.data;
};

export const uploadImage = async (file) => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('img', file);
    const response = await axios.post('https://oxuaz.davidjs.dev/img', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data.url || response.data.img || response.data;
};

export const createNews = async (newsData) => {
    const token = localStorage.getItem("admin_token");
    const response = await api.post('/news', newsData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateNews = async (id, newsData) => {
    const token = localStorage.getItem("admin_token");
    const response = await api.patch(`/news/${id}`, newsData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};


export const deleteNews = async (id) => {
    const token = localStorage.getItem("admin_token");
    const response = await api.delete(`/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
export const getNewsPaginated = async (page = 1, limit = 10) => {
  const { data } = await axios.get(`https://oxuaz.davidjs.dev/news_page/${page}?limit=${limit}`);
  return data; 
};