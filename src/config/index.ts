import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://api.weatherapi.com/v1",
  timeout: 1000,
});
