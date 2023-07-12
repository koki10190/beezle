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
function DisplayVerifyUser({ isOpen, setVerifyUser, verifyUser }: { isOpen: boolean; setVerifyUser: any; verifyUser: any }) {
	return (
		<>
			<div className={`navigation-panel ${!isOpen ? "display-panel-full" : "display-panel"} main-panel`}>
				<h1>Verify User</h1>
				<input
					className="post-edit-textarea"
					onChange={(ev: any) => setVerifyUser(ev.target.value)}
					placeholder="Type the @ of the user to verify. (Do not verify anyone without permission, you will be banned!)"
				></input>
				<button
					onClick={() => verifyUser()}
					className="post-edit-save"
				>
					Verify User
				</button>
			</div>
		</>
	);
}
function VerifyUser() {
	const navigate = useNavigate();
	const [me, setMe] = useState({} as UserType);
	const [isOpen, setOpen] = useState(true);
	const [userVerify, setVerifyUser] = useState("");

	useEffect(() => {
		(async () => {
			const data = (await GetUserData()).user;
			setMe(data);

			if (data.moderator || data.owner) {
			} else return navigate("/");
		})();
	}, []);

	const verifyUser = async () => {
		console.log(userVerify);
		const tst = toast("Verifying @" + userVerify, {
			icon: Icons.spinner,
			progressStyle: {
				backgroundColor: "yellow",
			},
			theme: "dark",
			hideProgressBar: true,
		});
		const res = await axios.post(`${api_url}/mod/verify-user`, {
			token: localStorage.getItem("auth_token"),
			handle: userVerify,
		});

		if (res.data.error) {
			toast.dismiss(tst);
			toast("There was an error when verifying the user", {
				icon: Icons.error,
				progressStyle: {
					backgroundColor: "yellow",
				},
				theme: "dark",
				hideProgressBar: false,
			});
		} else {
			toast.dismiss(tst);
			toast("The user has been verified successfully", {
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
			<DisplayVerifyUser
				isOpen={isOpen}
				setVerifyUser={setVerifyUser}
				verifyUser={verifyUser}
			/>
		</>
	);
}

export default VerifyUser;
