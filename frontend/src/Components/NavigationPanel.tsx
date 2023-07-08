import { useState, useRef, useEffect } from "react";
import GetUserData from "../api/GetUserData";
import "./navigation.css";
import socket from "../io/socket";
import { Icons, toast } from "react-toastify";

function NavigationPanel() {
	if (window.innerWidth <= 1200) {
		localStorage.setItem("navigation_panel", "false");
	}

	const [isOpen, setPanel] = useState(localStorage.getItem("navigation_panel") === "true" ? true : false);
	const [counter, setCounter] = useState(0);
	const navOpened = useRef<HTMLDivElement>(null);
	const notifCounter = useRef<HTMLSpanElement>(null);

	const logout = () => {
		localStorage.removeItem("auth_token");
		window.location.href = "/";
	};

	const myProfile = async () => {
		const data = (await GetUserData()).user;

		window.location.href = `/profile/${data.handle}`;
	};

	const navigationPanel = () => {
		setPanel(!isOpen);
	};

	useEffect(() => {
		const notifs = JSON.parse(localStorage.getItem("notifs") ?? "[]") as string[];
		setCounter(notifs.length);
		// if (counter <= 0) notifCounter.current!.innerText = ``;
		// socket.on("notification", async (notif: string, url: string) => {
		// 	const notifs = JSON.parse(localStorage.getItem("notifs") ?? "[]") as string[];
		// 	notifs.unshift(notif);

		// 	localStorage.setItem("notifs", JSON.stringify(notifs));
		// 	window.dispatchEvent(new Event("notif-update"));
		// 	setCounter(notifs.length);
		// 	notifCounter.current!.innerText = `(${counter})`;
		// });

		if (!isOpen) {
			document.querySelector(".main-panel")!.classList.add("scale-twice");

			document.querySelector(".main-panel")!.classList.remove("remove-main");
		} else {
			document.querySelector(".main-panel")!.classList.remove("scale-twice");
			document.querySelector(".main-panel")!.classList.add("remove-main");
		}
		localStorage.setItem("navigation_panel", `${isOpen}`);
	}, [isOpen]);

	useEffect(() => {
		if (counter <= 0) notifCounter.current!.innerText = ``;
		socket.on("notification", async (notif: string, url: string) => {
			const notifs = JSON.parse(localStorage.getItem("notifs") ?? "[]") as string[];
			notifs.unshift(notif);

			localStorage.setItem("notifs", JSON.stringify(notifs));
			window.dispatchEvent(new Event("notif-update"));
			setCounter(notifs.length);

			// toast("You've receieved a new notification", {
			// 	autoClose: 3000,
			// 	onClick: () => (window.location.href = "/notifications"),
			// 	theme: "dark",
			// 	hideProgressBar: true,
			// 	icon: Icons.info,
			// });
		});
	}, [true]);

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
					display: isOpen ? "inline-block" : "none",
				}}
				className="navigation-panel nav-pad-right"
			>
				<div className="icon"></div>
				<div className="nav-buttons">
					<a href="/home">
						Home <i className="fa-solid fa-house"></i>
					</a>
					<a href="/notifications">
						<span ref={notifCounter}></span> Notifs{" "}
						<i className="fa-solid fa-bell"></i>
					</a>
					<a href="/explore">
						Explore <i className="fa-solid fa-globe"></i>
					</a>
					<a href="/search">
						Search <i className="fa-solid fa-magnifying-glass"></i>
					</a>
					<a href="/bookmarks">
						Bookmarks <i className="fa-solid fa-bookmark"></i>
					</a>
					<a onClick={myProfile}>
						Profile <i className="fa-solid fa-user"></i>
					</a>
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
