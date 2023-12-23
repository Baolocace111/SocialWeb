import axios from "axios";
const url =
  "localhost:8800";
// "social-api-ul9t.onrender.com";
// export const URL_OF_BACK_END = "https://" + url + "/api/";
export const URL_OF_BACK_END = "http://" + url + "/api/";
// export const WEBSOCKET_BACK_END = "wss://" + url;
export const WEBSOCKET_BACK_END = "ws://localhost:3030/";
export const makeRequest = axios.create({
  baseURL: URL_OF_BACK_END,
  withCredentials: true,
});
