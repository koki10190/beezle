import "./Welcome.css";
import GetUserData from "../api/GetUserData";
import RegisterForm from "./RegisterForm";
import { useState } from "react";
import LoginForm from "./LoginForm";
import socket from "../io/socket";
function Welcome() {
	if (localStorage.getItem("auth_token")) {
		(async () => {
			const data = await GetUserData();
			if (data) {
				// socket.emit("get-handle", data.user.handle);
				window.location.href = "/home";
			}
		})();
	} else {
	}

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
