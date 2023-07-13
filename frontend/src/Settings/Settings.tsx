import { useEffect, useState } from "react";
import NavigationPanel from "../Components/NavigationPanel";
import Display from "./Panels/Display";
import Navigate from "./Panels/Navigate";
import UserType from "../interfaces/UserType";
import GetUserData from "../api/GetUserData";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {
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
				setOpen={setOpen}
			/>
		</>
	);
}

export default Settings;
