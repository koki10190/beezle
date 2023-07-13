import { useEffect, useRef, useState } from "react";
import NavigationPanel from "../../Components/NavigationPanel";
import Navigate from "../Panels/Navigate";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../constants/ApiURL";

function Display({ isOpen, user }: { isOpen: boolean; user: UserType }) {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passTxt, setPassText] = useState("");
	const [emailTxt, setEmailText] = useState("");

	const changePassword = async () => {
		axios.post(`${api_url}/settings/change-password`, {
			token: localStorage.getItem("auth_token"),
			password,
		}).then(res => {
			if (res.data.error) {
				setPassText("Password must not be shorter than 8 characters.");

				axios.post(`${api_url}/api/logout`, {
					token: localStorage.getItem("auth_token"),
				}).then(() => {
					localStorage.removeItem("auth_token");
					navigate("/");
				});
			}
		});
	};

	const changeEmail = async () => {
		axios.post(`${api_url}/settings/change-email`, {
			token: localStorage.getItem("auth_token"),
			email,
		}).then(res => {
			if (res.data.error) {
				setPassText("Invalid E-Mail Address!");
			} else {
				setPassText("Check your E-Mail to confirm changes.");

				axios.post(`${api_url}/api/logout`, {
					token: localStorage.getItem("auth_token"),
				}).then(() => {
					localStorage.removeItem("auth_token");
					navigate("/");
				});
			}
		});
	};

	return (
		<div className={`navigation-panel ${!isOpen ? "display-panel-full" : "display-panel"} main-panel`}>
			<h1>E-Mail:</h1>
			<h3 style={{ marginTop: "-20px", color: "rgba(255,255,255,0.5)" }}>{user ? user.email : ""}</h3>
			<input
				className="post-edit-textarea"
				onChange={(ev: any) => setEmail(ev.target.value)}
				style={{
					width: "50%",
				}}
				placeholder="New E-Mail"
			></input>
			<button
				style={{
					width: "50%",
					display: "block",
				}}
				onClick={changeEmail}
				className="post-edit-save"
			>
				Change E-Mail
			</button>
			<p>{emailTxt}</p>
			<hr
				style={{
					marginTop: "25px",
				}}
				className="small-bar"
			/>
			<h1>Change Password</h1>
			<input
				style={{ marginTop: "-20px", width: "50%" }}
				className="post-edit-textarea"
				onChange={(ev: any) => setPassword(ev.target.value)}
				placeholder="New Password"
			></input>
			<button
				style={{
					width: "50%",
					display: "block",
				}}
				onClick={changePassword}
				className="post-edit-save"
			>
				Change Password
			</button>
			<p>{passTxt}</p>
		</div>
	);
}

function Credentials() {
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

export default Credentials;
