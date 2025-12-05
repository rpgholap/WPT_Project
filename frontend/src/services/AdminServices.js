import axios from "axios";
import { API_BASE_URL } from "../constants/APIConstants";
import { getToken } from "./TokenService";

const token = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getAllUsers = () => {
  return axios.get(`${API_BASE_URL}/admin/get-all-users`, token());
}

export const getAllUserOrders = () => {
  return axios.get(`${API_BASE_URL}/admin/user-orders`, token());
};

export const updateOrderStatus = (orderId, data) => {
  return axios.put(`${API_BASE_URL}/admin/user-orders/${orderId}/status`, data, token());
};

export const getAllSuppliers = () => {
  return axios.get(`${API_BASE_URL}/admin/get-all-suppliers`, token());
}

export const getAllSpareParts = () => {
  return axios.get(`${API_BASE_URL}/admin/get-all-spare-parts`, token());
}

export const getAllResponses = () => {
  return axios.get(`${API_BASE_URL}/admin/get-all-responses`, token());
}

export const getInventoryStatus = () => {
  return axios.get(`${API_BASE_URL}/admin/get-inventory-status`, token());
}

export const sendSparePartsRequest = (data) => {
  console.log(data);
  return axios.post(`${API_BASE_URL}/admin/send-request`, data,  token());
}

export const getSupplierResponses = () => {
 return axios.post(`${API_BASE_URL}/admin/get-supplier-responses`,  token());
}

export const approveSupplierResponse = (response_id) => {
 return axios.post(`${API_BASE_URL}/admin/approve-response/${response_id}`,  token());
}

export const completeRequest = (request_id, data) => {
 return axios.put(`${API_BASE_URL}/admin/request-complete/${request_id}`, data, token());
}

export const getInventorySummary = () => {
  return axios.get(`${API_BASE_URL}/admin/inventory`, token());
}

export const getInventoryTransactions = () => {
  return axios.get(`${API_BASE_URL}/admin/inventory-history`, token());
}