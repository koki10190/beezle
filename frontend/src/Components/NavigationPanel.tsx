import { useState, useRef, useEffect } from "react";
import GetUserData from "../api/GetUserData";
import "./navigation.css";
import socket from "../io/socket";
import { Icons, toast } from "react-toastify";
import notifToast from "../functions/notif";
import sanitize from "sanitize-html";
import axios from "axios";
import { api_url } from "../constants/ApiURL";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function iOS() {
	return (
		["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.userAgent) ||
		// iPad on iOS 13 detection
		(navigator.userAgent.includes("Mac") && "ontouchend" in document)
	);
}

function NavigationPanel() {
	const navigate = useNavigate();
	const [deferredPrompt, setPrompt] = useState<any>(null);
	if (window.innerWidth <= 1200) {
		localStorage.setItem("navigation_panel", "false");
	}

	const [isOpen, setPanel] = useState(localStorage.getItem("navigation_panel") === "true" ? true : false);
	const [counter, setCounter] = useState(0);
	const navOpened = useRef<HTMLDivElement>(null);
	const notifCounter = useRef<HTMLSpanElement>(null);

	const logout = () => {
		axios.post(`${api_url}/api/logout`, {
			token: localStorage.getItem("auth_token"),
		}).then(() => {
			localStorage.removeItem("auth_token");
			navigate("/");
		});
	};

	const myProfile = async () => {
		const data = (await GetUserData()).user;

		window.location.assign(`/profile/${data.handle}`);
	};

	const navigationPanel = () => {
		setPanel(!isOpen);
	};

	useEffect(() => {
		window.addEventListener("beforeinstallprompt", e => {
			e.preventDefault();
			setPrompt(e);
			console.log(e);
		});

		socket.on("notification", async (notif: string, url: string) => {
			const notifs = JSON.parse(localStorage.getItem("notifs") ?? "[]") as string[];
			notifs.unshift(notif);

			localStorage.setItem("notifs", JSON.stringify(notifs));
			window.dispatchEvent(new Event("notif-update"));
			setCounter(notifs.length);
			notifCounter.current!.innerText = `(${counter})`;
		});

		if (counter <= 0) notifCounter.current!.innerText = ``;
	}, []);

	useEffect(() => {
		const notifs = JSON.parse(localStorage.getItem("notifs") ?? "[]") as string[];
		setCounter(notifs.length);
		// if (counter <= 0) notifCounter.current!.innerText = ``;

		if (!isOpen) {
			document.querySelector(".main-panel")!.classList.add("scale-twice");

			document.querySelector(".main-panel")!.classList.remove("remove-main");
		} else {
			document.querySelector(".main-panel")!.classList.remove("scale-twice");
			document.querySelector(".main-panel")!.classList.add("remove-main");
		}
		localStorage.setItem("navigation_panel", `${isOpen}`);
	}, [isOpen]);

	window.addEventListener("update-notif-counter", () => {
		const notifs = JSON.parse(localStorage.getItem("notifs") ?? "[]");

		setCounter(notifs.length);
		window.document.title = notifs.length > 0 ? `Beezle | (${notifs.length})` : "Beezle";
	});

	useEffect(() => {
		notifCounter.current!.style.color = "yellow";
		notifCounter.current!.innerText = `(${counter})`;
	}, [counter]);

	return (
		<>
			<a
				onClick={navigationPanel}
				className="close-btn"
			>
				<i className="fa-solid fa-ellipsis"></i>
			</a>
			<div
				ref={navOpened}
				style={{ display: "none" }}
				id="navOpened"
			></div>
			<div
				style={{
					display: isOpen ? "inline-flex" : "none",
				}}
				className="navigation-panel nav-pad-right"
			>
				<div className="panel-icon"></div>
				<div className="nav-buttons">
					<a
						onClick={() => {
							navigate("/home");
						}}
					>
						Home <i className="fa-solid fa-house"></i>
					</a>
					<a
						onClick={() => {
							navigate("/notifications");
						}}
					>
						<span ref={notifCounter}></span> Notifs{" "}
						<i className="fa-solid fa-bell"></i>
					</a>
					<a
						onClick={() => {
							navigate("/explore");
						}}
					>
						Explore <i className="fa-solid fa-globe"></i>
					</a>
					<a
						onClick={() => {
							navigate("/now");
						}}
					>
						Right Now <i className="fa-solid fa-sparkles"></i>
					</a>
					<a
						onClick={() => {
							navigate("/dms");
						}}
					>
						DMs <i className="fa-solid fa-messages"></i>
					</a>
					<a
						onClick={() => {
							navigate("/search");
						}}
					>
						Search <i className="fa-solid fa-magnifying-glass"></i>
					</a>
					<a
						onClick={() => {
							navigate("/bookmarks");
						}}
					>
						Bookmarks <i className="fa-solid fa-bookmark"></i>
					</a>
					<a onClick={myProfile}>
						Profile <i className="fa-solid fa-user"></i>
					</a>
					<a onClick={() => navigate("/settings")}>
						Settings <i className="fa-solid fa-user-gear"></i>
					</a>
					<a onClick={() => navigate("/shop")}>
						Activity Shop <i className="fa-solid fa-cart-shopping-fast"></i>
					</a>
					{/* {iOS() ? (
						""
					) : (
						<a onClick={() => deferredPrompt.prompt()}>
							Install <i className="fa-solid fa-download"></i>
						</a>
					)} */}
					<a
						onClick={logout}
						style={{
							color: "red",
						}}
					>
						Log Out <i className="fa-solid fa-right-from-bracket"></i>
					</a>
				</div>
			</div>
		</>
	);
}

export default NavigationPanel;
