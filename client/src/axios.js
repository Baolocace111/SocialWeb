import axios from "axios";
export const URL_OF_BACK_END = "http://localhost:8800/api/";
export const makeRequest = axios.create({
  baseURL: URL_OF_BACK_END,
  withCredentials: true,
});
