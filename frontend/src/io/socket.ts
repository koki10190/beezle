import { io } from "socket.io-client";

const socket = io("${api_url}");
export default socket;
