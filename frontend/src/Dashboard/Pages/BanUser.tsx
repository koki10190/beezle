import { useEffect, useState, UIEvent } from "react";
import NavigationPanel from "../../Components/NavigationPanel";
import Display from "../Panels/Display";
import Navigate from "../Panels/Navigate";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import { useNavigate } from "react-router-dom";
import { ReportType } from "./ReportType";
import ReportBox from "./ReportBox";
import axios from "axios";
import { api_url } from "../../constants/ApiURL";
import { Icons, toast } from "react-toastify";
import uuid4 from "uuid4";
function DisplayBanUser({ isOpen, setUserBan, banUser }: { isOpen: boolean; setUserBan: any; banUser: any }) {
	return (
		<>
			<div className={`navigation-panel ${!isOpen ? "display-panel-full" : "display-panel"} main-panel`}>
				<h1>Ban User</h1>
				<input
					className="post-edit-textarea"
					onChange={(ev: any) => setUserBan(ev.target.value)}
					placeholder="Type the @ of the user to ban. (DOUBLE CHECK!)"
				></input>
				<button
					onClick={() => banUser()}
					className="post-edit-save"
				>
					Ban User
				</button>
			</div>
		</>
	);
}
function BanUser() {
	const navigate = useNavigate();
	const [me, setMe] = useState({} as UserType);
	const [isOpen, setOpen] = useState(true);
	const [userBan, setUserBan] = useState("");

	useEffect(() => {
		(async () => {
			const data = (await GetUserData()).user;
			setMe(data);

			if (data.moderator || data.owner) {
			} else return navigate("/");
		})();
	}, []);

	const banUser = async () => {
		console.log(userBan);
		const tst = toast("Banning @" + userBan, {
			icon: Icons.spinner,
			progressStyle: {
				backgroundColor: "yellow",
			},
			theme: "dark",
			hideProgressBar: true,
		});
		const res = await axios.post(`${api_url}/mod/ban-user`, {
			token: localStorage.getItem("auth_token"),
			handle: userBan,
		});

		if (res.data.error) {
			toast.dismiss(tst);
			toast("There was an error when banning the user", {
				icon: Icons.error,
				progressStyle: {
					backgroundColor: "yellow",
				},
				theme: "dark",
				hideProgressBar: false,
			});
		} else {
			toast.dismiss(tst);
			toast("The user has been banned successfully", {
				icon: Icons.error,
				progressStyle: {
					backgroundColor: "yellow",
				},
				theme: "dark",
				hideProgressBar: false,
			});
		}
	};

	return (
		<>
			<Navigate
				isOpen={isOpen}
				setOpen={setOpen}
			/>
			<DisplayBanUser
				isOpen={isOpen}
				setUserBan={setUserBan}
				banUser={banUser}
			/>
		</>
	);
}

export default BanUser;
