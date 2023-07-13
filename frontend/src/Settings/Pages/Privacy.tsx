import { useEffect, useState } from "react";
import NavigationPanel from "../../Components/NavigationPanel";
import Navigate from "../Panels/Navigate";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../constants/ApiURL";

function Display({ isOpen, user }: { isOpen: boolean; user: UserType }) {
	const navigate = useNavigate();
	console.log(user);
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
