import { useEffect, useRef, useState } from "react";
import GetUserData from "../api/GetUserData";
import NavigationPanel from "../Components/NavigationPanel";
import MainPanel from "../Components/MainPanel";
import InfoPanel from "../Components/InfoPanel";
import Profile from "../Components/MainPanel/Profile";
import EditProfile from "../Components/MainPanel/EditProfile";
import Post from "../Components/MainPanel/Post";
import socket from "../io/socket";
import uuid4 from "uuid4";
import "./HomeNotification.css";
import axios from "axios";
import { api_url } from "../constants/ApiURL";
import { Icons, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function HomeNotification() {
	let user;
	const [notifs, setNotifs] = useState<string[]>([]);
	(async () => {
		const data = await GetUserData();
		if (data.error) {
			const navigate = useNavigate();
			navigate("/");
		}
	})();

	useEffect(() => {
		(async () => {
			user = (await GetUserData()).user;
			// avatar.current!.src = user.avatar;
			// banner.current!.src = user.banner;
			// username.current!.textContent = user.displayName;
		})();
	}, []);

	useEffect(() => {
		const m_notifs = JSON.parse(localStorage.getItem("notifs") ?? "[]");
		setNotifs(m_notifs);
	}, [true]);

	window.addEventListener("notif-update", () => {
		const m_notifs = JSON.parse(localStorage.getItem("notifs") ?? "[]");
		setNotifs(m_notifs);
	});

	return (
		<>
			{/* <img ref={banner} width={500} />
			<img ref={avatar} width={250} />
			<h1 ref={username}></h1> */}
			<div className="main-pages">
				<InfoPanel />
				<div className="navigation-panel main-panel search-panel">
					<p
						onClick={() =>
							axios
								.post(`${api_url}/api/clear-notifs`, {
									token: localStorage.getItem(
										"auth_token"
									),
								})
								.then(res => {
									localStorage.setItem(
										"notifs",
										"[]"
									);
									setNotifs([]);
									toast(
										"Cleared Notifications",
										{
											icon: Icons.success,
											progressStyle: {
												backgroundColor: "yellow",
											},
											theme: "dark",
											hideProgressBar: true,
											autoClose: 1000,
										}
									);
									window.dispatchEvent(
										new Event(
											"update-notif-counter"
										)
									);
								})
						}
						className="refresh"
					>
						<i className="fa-solid fa-broom-wide"></i> Clear Notifications
					</p>
					<h1>Notifications</h1>
					<hr className="small-bar"></hr>
					{notifs.map(notif => (
						<div
							className="notif"
							key={uuid4()}
							dangerouslySetInnerHTML={{
								__html: notif,
							}}
						></div>
					))}
				</div>
				<NavigationPanel />
			</div>
		</>
	);
}

export default HomeNotification;
