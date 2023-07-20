import { useEffect, useState } from "react";
import UserType from "../interfaces/UserType";
import GetUserData from "../api/GetUserData";
import "./Auth.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { api_url } from "../constants/ApiURL";

function Auth() {
	const { appName, appID } = useParams();
	const [user, setUser] = useState<UserType>();
	useEffect(() => {
		(async () => {
			if (!localStorage.getItem("auth_token")) return (window.location.href = "/");
			const data = (await GetUserData()).user;
			setUser(data);
		})();
	}, []);

	const auth = async () => {
		const res = await axios.post(`${api_url}/auth`, {
			token: localStorage.getItem("auth_token"),
			appID,
		});
		console.log(user?.handle);
		await axios.post(`${res.data.uri}/beezle-auth`, {
			handle: user?.handle,
			api_key: res.data.api_key,
		});
	};

	return (
		<>
			<div className="auth">
				<div
					style={{ backgroundImage: `url("${user?.avatar}")` }}
					className="auth-avatar"
				></div>
				<p className="auth-name">{user?.displayName}</p>
				<p className="auth-handle">@{user?.handle}</p>
				<div className="auth-center">
					<h2>{appName} wants to authenticate to:</h2>
					<h3>Set Rich Presence on your account</h3>
				</div>
				<button
					onClick={auth}
					className="auth-btn"
				>
					AUTHENTICATE
				</button>
			</div>
		</>
	);
}

export default Auth;
