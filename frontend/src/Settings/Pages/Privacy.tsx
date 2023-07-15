import { useEffect, useState, useTransition } from "react";
import NavigationPanel from "../../Components/NavigationPanel";
import Navigate from "../Panels/Navigate";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../constants/ApiURL";
import SpotifyWebApi from "spotify-web-api-js";

function Display({ isOpen, user }: { isOpen: boolean; user: UserType }) {
	const navigate = useNavigate();

	const authSpotify = async () => {
		const endpoint = "https://accounts.spotify.com/authorize";
		const redirectURI = "https://ebb2-95-83-232-242.ngrok-free.app";
		const clientID = "29d3f659c14a45d684a030365c9e4afb";

		const scopes = ["user-read-currently-playing"];

		const loginURL = `${endpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join(
			"%20"
		)}&response_type=code&show_dialog=true`;

		window.location.href = loginURL;
		/*
		https://accounts.spotify.com/authorize?client_id=29d3f659c14a45d684a030365c9e4afb&redirect_uri=https://ebb2-95-83-232-242.ngrok-free.app/auth/spotify&scope=user-read-currently-playing%20user-read-recently-played%20user-read-playback-state%20user-top-read%20user-modify-playback-state&response_type=token&show_dialog=true
		*/
	};

	return (
		<div className={`navigation-panel ${!isOpen ? "display-panel-full" : "display-panel"} main-panel`}>
			<h1>Handle:</h1>
			<h3 style={{ marginTop: "-20px", color: "rgba(255,255,255,0.5)" }}>@{user ? user.handle : ""} (Unchangeable)</h3>
			<h1>Private Account:</h1>
			<button
				style={{ marginTop: "-20px" }}
				className="post-edit-save-btn"
				onClick={() =>
					axios
						.post(`${api_url}/settings/private-user`, {
							token: localStorage.getItem("auth_token"),
						})
						.then(() => window.location.reload())
				}
			>
				{user ? (user.private ? "UNPRIVATE" : "PRIVATE") : "UNPRIVATE"}
			</button>
			<br></br>
			<h1>Connected Accounts:</h1>
			<br></br>
			<button
				style={{ marginTop: "-20px" }}
				className="post-edit-save-btn"
				onClick={authSpotify}
				// disabled={user ? (user.connected_accounts?.spotify ? true : false) : false}
			>
				{user ? (user.connected_accounts?.spotify ? "SPOTIFY CONNECTED" : "CONNECT SPOTIFY") : "CONNECT SPOTIFY"}
			</button>
		</div>
	);
}

function PrivacySettings() {
	const navigate = useNavigate();
	const [me, setMe] = useState({} as UserType);
	const [isOpen, setOpen] = useState(true);

	useEffect(() => {
		(async () => {
			const data = (await GetUserData()).user;
			setMe(data);
			console.log(data);
		})();
	}, []);

	return (
		<>
			<Navigate
				isOpen={isOpen}
				setOpen={setOpen}
			/>
			<Display
				isOpen={isOpen}
				user={me}
			/>
		</>
	);
}

export default PrivacySettings;
