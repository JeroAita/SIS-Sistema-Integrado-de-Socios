import axios from "axios";

console.log("API baseURL:", import.meta.env.VITE_API_URL); 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api",
  withCredentials: true, 
});

export default api;
