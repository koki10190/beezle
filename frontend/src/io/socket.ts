import { io } from "socket.io-client";
import { api_url } from "../constants/ApiURL";

const socket = io(`${api_url}`);
export default socket;
