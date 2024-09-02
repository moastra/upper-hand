import { io } from "socket.io-client";

const socket = io("172.24.64.1:5000", { withCredentials: true });

export default socket;
