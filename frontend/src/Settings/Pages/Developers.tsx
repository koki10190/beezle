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
	const [showToken, setShowToken] = useState(false);

	return (
		<div className={`navigation-panel ${!isOpen ? "display-panel-full" : "display-panel"} main-panel`}>
			<h1>Bot Account:</h1>
			<button
				style={{ marginTop: "-20px" }}
				className="post-edit-save-btn"
				onClick={() =>
					axios
						.post(`${api_url}/bot/make-bot`, {
							token: localStorage.getItem("auth_token"),
						})
						.then(() => window.location.reload())
				}
			>
				{user ? (user.bot_account ? "TURN OFF BOT ACCOUNT" : "TURN ON BOT ACCOUNT") : "TURN OFF BOT ACCOUNT"}
			</button>

			<h1>Token:</h1>
			<h3>DO NOT Send the token to ANYONE!</h3>
			<button
				style={{ marginTop: "-20px" }}
				className="post-edit-save-btn"
				onClick={() => setShowToken(!showToken)}
			>
				{showToken ? "HIDE TOKEN" : "SHOW TOKEN"}
			</button>
			<p
				style={{
					wordWrap: "break-word",
					fontSize: "10px",
				}}
			>
				{showToken ? localStorage.getItem("auth_token") : ""}
			</p>
		</div>
	);
}

function Developers() {
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

export default Developers;
