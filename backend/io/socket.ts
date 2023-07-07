import { Socket, Server as ioServer } from "socket.io";
import http from "http";
var io: ioServer;

function handleConnections() {
	io.on("connection", (socket: Socket) => {
		// const ip =
		// 	socket.handshake.headers["x-forwarded-for"] ||
		// 	socket.conn.remoteAddress.split(":")[3];
		console.log("User connected, ID: " + socket.id);

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
