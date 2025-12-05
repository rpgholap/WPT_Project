import axios from "axios";
import { API_BASE_URL } from "../constants/APIConstants";
import { getToken } from "./TokenService";

const token = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getAssignedRequests = () => {
  return axios.get(`${API_BASE_URL}/supplier/assigned-requests`, token());
}

export const respondToRequest = (data) => {
  return axios.post(`${API_BASE_URL}/supplier/respond-request`, data, token());
}

export const getDeliveryStatus = () => {
  return axios.get(`${API_BASE_URL}/supplier/delivery-status`, token());
}