import { api } from "../api";

const Like = async (id) => {
    try {
        const response = await api.patch(`/news_like/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
const disLike = async (id) => {
    try {
        const response = await api.patch(`/news_dislike/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export { Like, disLike }