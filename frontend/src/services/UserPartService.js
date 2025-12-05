import axios from "axios";
import { API_BASE_URL } from "../constants/APIConstants";
import { getToken } from "./TokenService";

const token = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export function getAllParts() {
  return axios.get(`${API_BASE_URL}/get-all-spare-parts`, token());
}

export function getPartById(partId) {
  return axios.get(`${API_BASE_URL}/get-spare-part-by-id/${partId}`, token());
}

export function addToCart(data) {
  console.log(data);
  return axios.post(`${API_BASE_URL}/cart/add`, data, token());
}

export function buyNow(data) {
  console.log(data);
  return axios.post(`${API_BASE_URL}/orders/buy-now`, data, token());
}