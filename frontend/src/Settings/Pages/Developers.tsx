import { useEffect, useState, useTransition } from "react";
import NavigationPanel from "../../Components/NavigationPanel";
import Navigate from "../Panels/Navigate";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../constants/ApiURL";
import SpotifyWebApi from "spotify-web-api-js";

interface AppType {
	name: string;
	id: string;
	uri: string;
	by: string;
}

function Display({ isOpen, user }: { isOpen: boolean; user: UserType }) {
	const navigate = useNavigate();
	const [showToken, setShowToken] = useState(false);
	const [apps, setApps] = useState<AppType[]>([] as AppType[]);
	const [uri, setUri] = useState("");
	const [name, setName] = useState("");

	useEffect(() => {
		(async () => {
			setApps((await axios.post(`${api_url}/app/get`, { token: localStorage.getItem("auth_token") })).data.apps as AppType[]);
		})();
	}, []);

	const createApp = async () => {
		if (uri === "" || name === "") return;

		const res = await axios.post(`${api_url}/app/create`, {
			token: localStorage.getItem("auth_token"),
			uri,
			name,
		});
		navigate(0);
	};

	const deleteApp = async (id: string) => {
		const res = await axios.post(`${api_url}/app/delete`, {
			token: localStorage.getItem("auth_token"),
			id,
		});
		navigate(0);
	};

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
				style={
					showToken
						? {
								wordWrap: "break-word",
								fontSize: "15px",
								backgroundColor: "#5e5700",
								width: "fit-content",
								color: "white",
								padding: "5px 10px 5px 10px",
								borderRadius: "15px",
						  }
						: {}
				}
			>
				{showToken ? localStorage.getItem("auth_token") : ""}
			</p>
			<hr
				style={{
					marginTop: "30px",
				}}
				className="small-bar"
			/>
			<h1>Create Application</h1>
			<input
				style={{ marginTop: "-20px", width: "50%" }}
				className="post-edit-textarea"
				placeholder="Name"
				onChange={(e: any) => setName(e.target.value)}
			></input>
			<br></br>
			<input
				style={{ marginTop: "5px", width: "50%" }}
				className="post-edit-textarea"
				placeholder="Redirect URI"
				onChange={(e: any) => setUri(e.target.value)}
			></input>
			<button
				style={{
					width: "50%",
					display: "block",
				}}
				onClick={createApp}
				className="post-edit-save"
			>
				Create Application
			</button>
			<hr
				style={{
					marginTop: "30px",
				}}
				className="small-bar"
			/>
			<div className="auth-apps">
				{apps
					? apps.map(app => (
							<>
								<div className="auth-app">
									<p>
										<span
											style={{
												color: "rgba(255,255,255,0.5)",
											}}
										>
											Name:
										</span>{" "}
										{app.name}
									</p>
									<p>
										<span
											style={{
												color: "rgba(255,255,255,0.5)",
											}}
										>
											Redirect
											URI:
										</span>{" "}
										{app.uri}
									</p>
									<p>
										<a
											className="link"
											href={
												"https://" +
												window
													.location
													.host +
												"/auth/" +
												app.name.replace(
													" ",
													"%20"
												) +
												"/" +
												app.id
											}
										>
											Auth
											URL
										</a>
									</p>
									<button
										onClick={() =>
											deleteApp(
												app.id
											)
										}
										style={{
											width: "100%",
										}}
										className="post-edit-save-red"
									>
										DELETE
									</button>
								</div>
							</>
					  ))
					: ""}
			</div>
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
