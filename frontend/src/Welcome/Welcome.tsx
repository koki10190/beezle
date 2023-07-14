import "./Welcome.css";
import GetUserData from "../api/GetUserData";
import RegisterForm from "./RegisterForm";
import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import socket from "../io/socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url } from "../constants/ApiURL";

function Welcome() {
	const navigate = useNavigate();

	const getTokenFromUrl = () => {
		return window.location.hash
			.substring(1)
			.split("&")
			.reduce((initial: any, item: any) => {
				let parts = item.split("=");
				initial[parts[0]] = decodeURIComponent(parts[1]);
				return initial;
			}, {});
	};

	const getSpotifyCodeFromURL = () => window.location.search.split("=");

	useEffect(() => {
		(async () => {
			if (localStorage.getItem("auth_token")) {
				const code = getSpotifyCodeFromURL();
				console.log(code);
				if (code.length > 1 && code[1] !== "") {
					const save_token = await axios.post(`${api_url}/user/connect-spotify`, {
						code,
						token: localStorage.getItem("auth_token"),
					});
				}

				const data = await GetUserData();
				if (data) {
					socket.emit("get-handle", data.user.handle);
					navigate("/home");
				}
			} else {
			}
		})();
	}, []);

	const [isRegisterForm, setRegisterForm] = useState(false);

	const handleStateChange = (bool: boolean) => {
		console.log(bool);
		setRegisterForm(bool);
	};

	return (
		<>
			<nav>
				<div className="icon"></div>
			</nav>
			<div>
				<header>
					<h1>Beezle</h1>
					<h3>An upcoming social media platform</h3>
				</header>
				<div className="other-side">
					{isRegisterForm ? (
						<RegisterForm state_change={handleStateChange} />
					) : (
						<LoginForm state_change={handleStateChange} />
					)}
				</div>
			</div>
		</>
	);
}

export default Welcome;
