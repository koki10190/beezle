import { Socket, Server as ioServer } from "socket.io";
import http from "http";
import sanitize from "sanitize-html";
import Message from "../models/Message";
import uuid4 from "uuid4";
import User from "../models/User";
import { VerifyBadgeText } from "../functions/badges";
import UserType from "../interfaces/UserType";
import CONSTANTS from "../constants/constants";
var io: ioServer;

interface SocketType {
	[handle: string]: Socket;
}
const sockets: SocketType = {};

function getSockets(): SocketType {
	return sockets;
}

interface MessageType {
	handle: string;
	avatar: string;
	name: string;
	content: string;
	me: boolean;
}

function handleConnections() {
	io.on("connection", (socket: Socket) => {
		const ip = socket.handshake.headers["x-forwarded-for"] || socket.conn.remoteAddress.split(":")[3];
		console.log("User connected, ID: " + socket.id);

		socket.on("disconnect", () => {
			console.log("User Disconnected " + socket.id);
		});

		socket.on("get-handle", (handle: string) => {
			sockets[handle] = socket;
		});

		socket.on("message", async (from: string, to: string, msg: MessageType) => {
			msg.content = sanitize(msg.content);

			const message = await Message.create({
				handle: msg.handle,
				avatar: msg.avatar,
				name: msg.name,
				content: msg.content,
				to,
				channel: `${from}&${to}`,
				messageID: uuid4(),
			});

			const receiver = (await User.find({ handle: to }).limit(1))[0];
			const m_user = (await User.find({ handle: from }).limit(1))[0];
			const url = `${CONSTANTS.FRONTEND_URL}/profile/${m_user.handle}`;
			const notif = `<a href="${url}" class="handle-notif"><div style="background-image: url(${
				m_user?.avatar
			})" class="notifAvatar"></div> @${VerifyBadgeText(m_user as any as UserType)} sent you a message!</a>`;

			if (receiver.handle != m_user.handle) {
				if (getSockets()[receiver!.handle]) getSockets()[receiver.handle].emit("notification", notif, url);

				receiver.notifications.push(notif);
				receiver.save();
			}

			if (sockets[to]) sockets[to].emit("get-message", from, to, msg);
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

export { initSocket, getSockets };
