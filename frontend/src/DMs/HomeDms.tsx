import { useEffect, useRef, useState, UIEvent } from "react";
import GetUserData from "../api/GetUserData";
import socket from "../io/socket";
import UserType from "../interfaces/UserType";

// import "./DMs.css";
import styles from "./DMs2.module.css";
import FriendDM from "./Components/FriendDM";
import FriendMessage from "./Components/FriendMessage";
import uuid4 from "uuid4";
import axios from "axios";
import { api_url } from "../constants/ApiURL";
import notifToast from "../functions/notif";
import sanitize from "sanitize-html";

interface MessageType {
	handle: string;
	avatar: string;
	name: string;
	content: string;
	me: boolean;
	channel: string;
	messageID: string;
}
let m_shiftDown = false;
let m_user: UserType;
let dm = "";
let messagesCheck = 0;

function HomeDms() {
	const [user, setUser] = useState<UserType>({} as UserType);
	const [friends, setFriends] = useState<string[]>([] as string[]);
	const [dm_set, setDM] = useState(false);
	const [dm_user, setDMUser] = useState("");
	const [openSidePanel, setSidePanel] = useState(true);
	const [messages, setMessages] = useState<MessageType[]>([] as MessageType[]);

	const scrollToBottom = (id: string) => {
		const element = document.getElementById(id) as any;
		element.scrollTop = element.scrollHeight;
	};

	useEffect(() => {
		scrollToBottom("main-page");
	}, [messages]);

	useEffect(() => {
		console.log("yo2");
		socket.on("get-message", (from: string, to: string, msg: MessageType) => {
			console.log(from, to);
			console.log(dm, m_user.handle);
			if (from !== dm || to !== m_user.handle) return;
			console.log(msg);
			messages.push(msg);
			// if (messages.find(x => x.messageID === msg.messageID)) return;
			setMessages(prev => [...prev, msg]);
			scrollToBottom("main-page");
		});

		(async () => {
			// if (window.innerWidth <= 1000) setSidePanel(false);
			const data = await GetUserData();
			m_user = data.user;
			setUser(data.user);
			setFriends(data.user.following);

			window.addEventListener("keydown", (event: KeyboardEvent) => {
				if (event.key === "Shift") {
					m_shiftDown = true;
				}

				if (event.key == "Enter" && !m_shiftDown) {
					sendMessage(
						((document.querySelector("#dms-field") as HTMLTextAreaElement)
							? (document.querySelector(
									"#dms-field"
							  ) as HTMLTextAreaElement)
							: (document.querySelector(
									"#dms-field-full"
							  ) as HTMLTextAreaElement)
						).value
					);
				}
			});

			window.addEventListener("keyup", (event: KeyboardEvent) => {
				if (event.key === "Shift") {
					m_shiftDown = false;
				}
			});
		})();
	}, []);

	// useEffect(() => {
	// }, [friends]);

	const changeDM = (handle: string) => {
		console.log(handle);
		dm = handle;
		setDM(true);
		setDMUser(handle);
		setMessages([]);

		axios.post(`${api_url}/api/fetch-messages`, {
			token: localStorage.getItem("auth_token"),
			of: handle,
		}).then(res => {
			const messages: MessageType[] = res.data;
			setMessages(messages);
		});

		// if (window.innerWidth <= 1000) setSidePanel(false);
	};

	const sendMessage = async (content: string) => {
		scrollToBottom("main-page");
		if (content === "") return;
		if (m_user?.bot_account) return;
		const message: MessageType = {
			handle: m_user.handle,
			avatar: m_user.avatar,
			name: m_user.displayName,
			content: content.replace(/(.{4000})..+/, "$1"),
			me: false,
			channel: `${m_user.handle}&${dm}`,
			messageID: uuid4(),
		};
		if (message.handle === "" || !message.handle) return;
		console.log(dm);
		socket.emit("message", m_user.handle, dm, message);
		message.me = true;

		messages.push(message);
		setMessages(prev => [...prev, message]);
		scrollToBottom("main-page");

		((document.querySelector("#dms-field") as HTMLTextAreaElement)
			? (document.querySelector("#dms-field") as HTMLTextAreaElement)
			: (document.querySelector("#dms-field-full") as HTMLTextAreaElement)
		).value = "";
		scrollToBottom("main-page");
		(document.querySelector("#dms-field") as HTMLTextAreaElement).value = "";
	};

	return (
		<>
			<div
				style={{
					display: openSidePanel ? "block" : "none",
				}}
				className={styles["dms-side-panel"]}
			>
				{friends.map(handle => (
					<FriendDM
						changeDM={changeDM}
						key={handle}
						handle={handle}
					/>
				))}
			</div>
			<div
				id="main-page"
				className={styles["main-pages"]}
			>
				{messages.length <= 0 ? (
					<h1 style={{ color: "rgba(255,255,255,0.2)" }}>No messages.</h1>
				) : (
					messages.map(msg => (
						<FriendMessage
							key={uuid4()}
							me={msg.me}
							avatar={msg.avatar}
							content={msg.content}
							handle={msg.handle}
							name={msg.name}
						/>
					))
				)}
				{/* {openSidePanel && window.innerWidth <= 1000 ? ( */}
				{/* "" */}
				{/* ) : dm_set ? ( */}
				<textarea
					id="dms-field"
					maxLength={4000}
					className={styles["dms-field"]}
					placeholder={"Send message to @" + dm_user}
				></textarea>
				{/* ) : ( */}
				{/* "" */}
				{/* )} */}
			</div>
		</>
	);
}

export default HomeDms;
