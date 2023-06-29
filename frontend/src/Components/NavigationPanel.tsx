import { useState, useRef, useEffect } from "react";
import GetUserData from "../api/GetUserData";
import "./navigation.css";

function NavigationPanel() {
	if (window.innerWidth <= 1200) {
		localStorage.setItem("navigation_panel", "false");
	}

	const [isOpen, setPanel] = useState(
		localStorage.getItem("navigation_panel") === "true" ? true : false
	);
	const navOpened = useRef<HTMLDivElement>(null);

	const logout = () => {
		localStorage.removeItem("auth_token");
		window.location.reload();
	};

	const myProfile = async () => {
		const data = (await GetUserData()).user;

		window.location.href = `/profile/${data.handle}`;
	};

	const navigationPanel = () => {
		setPanel(!isOpen);
	};

	useEffect(() => {
		if (!isOpen) {
			document.querySelector(".main-panel")!.classList.add(
				"scale-twice"
			);

			document.querySelector(
				".main-panel"
			)!.classList.remove("remove-main");
		} else {
			document.querySelector(
				".main-panel"
			)!.classList.remove("scale-twice");
			document.querySelector(".main-panel")!.classList.add(
				"remove-main"
			);
		}
		localStorage.setItem("navigation_panel", `${isOpen}`);
	}, [isOpen]);

	return (
		<>
			<a onClick={navigationPanel} className="close-btn">
				<i className="fa-solid fa-ellipsis"></i>
			</a>
			<div
				ref={navOpened}
				style={{ display: "none" }}
				id="navOpened"
			></div>
			<div
				style={{
					display: isOpen
						? "inline-block"
						: "none",
				}}
				className="navigation-panel nav-pad-right"
			>
				<div className="icon"></div>
				<div className="nav-buttons">
					<a href="/home">
						Home{" "}
						<i className="fa-solid fa-house"></i>
					</a>
					<a href="/notifications">
						Notifications{" "}
						<i className="fa-solid fa-bell"></i>
					</a>
					<a href="/explore">
						Explore{" "}
						<i className="fa-solid fa-magnifying-glass"></i>
					</a>
					<a href="/bookmarks">
						Bookmarks{" "}
						<i className="fa-solid fa-bookmark"></i>
					</a>
					<a onClick={myProfile}>
						Profile{" "}
						<i className="fa-solid fa-user"></i>
					</a>
					<a
						onClick={
							logout
						}
						style={{
							color: "red",
						}}
					>
						Log Out{" "}
						<i className="fa-solid fa-right-from-bracket"></i>
					</a>
				</div>
			</div>
		</>
	);
}

export default NavigationPanel;
