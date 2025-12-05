import axios from "axios";
import { API_BASE_URL } from "../constants/APIConstants";

export function registration(formData) {
    return axios.post(`${API_BASE_URL}/registration`,formData);
}