import axios from "axios";
import { API_BASE_URL } from "../constants/APIConstants";
import { getToken } from "./TokenService";

const token = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const viewOrderDetails = () =>{
    return axios.get(`${API_BASE_URL}/get-user-order-details`, token());
}
  
export const cancelOrder = (orderId) => {
    return axios.put(`${API_BASE_URL}/user/cancel-user-order/${orderId}`, {}, token());
}
  
export const editOrder = (orderId, sparePart_Id, data) => {
    //console.log(orderId, sparePart_Id, data);
    return axios.put(`${API_BASE_URL}/user/edit-order/${orderId}/${sparePart_Id}`, data, token());
}
  
export const buyNow = (data) => {
    return axios.post(`${API_BASE_URL}/orders/buy-now`, data, token());
}
  
