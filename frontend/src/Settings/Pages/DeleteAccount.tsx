import { useEffect, useState } from "react";
import NavigationPanel from "../../Components/NavigationPanel";
import Display from "../Panels/Display";
import Navigate from "../Panels/Navigate";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../constants/ApiURL";

function DisplayDelete({ isOpen = false }) {
	const navigate = useNavigate();
	const deleteAccount = () => {
		axios.post(`${api_url}/settings/delete-user`, {
			token: localStorage.getItem("auth_token"),
		}).then(res => navigate("/"));
	};

	return (
		<div className={`navigation-panel ${!isOpen ? "display-panel-full" : "display-panel"} main-panel`}>
			<h1>Are you sure you want to delete your account?</h1>
			<button
				onClick={deleteAccount}
				className="post-edit-save-red"
			>
				YES
			</button>
		</div>
	);
}

function DeleteAccount() {
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
	console.log("A");

	return (
		<>
			<Navigate
				isOpen={isOpen}
				setOpen={setOpen}
			/>
			<DisplayDelete isOpen={isOpen} />
		</>
	);
}

export default DeleteAccount;
