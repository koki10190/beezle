import { Socket, Server as ioServer } from "socket.io";
import http from "http";
var io: ioServer;

function handleConnections() {
	io.on("connection", (socket: Socket) => {
		console.log("User connected: " + socket.id);

		socket.on("disconnect", () => {
			console.log("User Disconnected " + socket.id);
		});
	});
}

function initSocket(server: http.Server): ioServer {
	io = new ioServer(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	handleConnections();
	return io;
}

export { initSocket };
