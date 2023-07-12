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

function DisplayReports({ isOpen, detectScrolling, reports, refresh }: { isOpen: boolean; detectScrolling: any; refresh: any; reports: ReportType[] }) {
	return (
		<>
			<div
				onScroll={detectScrolling}
				className={`navigation-panel ${!isOpen ? "display-panel-full" : "display-panel"} main-panel`}
			>
				<h1
					onClick={refresh}
					className="reload-reports"
				>
					<i className="fa-solid fa-rotate-right"></i> Refresh Reports
				</h1>
				{reports.length > 0 ? (
					reports.map(report => (
						<ReportBox
							key={uuid4()}
							user={report.user}
							postID={report.postID}
							refresh={refresh}
						/>
					))
				) : (
					<h1>No reports have been found.</h1>
				)}
			</div>
		</>
	);
}

function Reports() {
	const navigate = useNavigate();
	const [me, setMe] = useState({} as UserType);
	const [isOpen, setOpen] = useState(true);
	const [reports, setReports] = useState<ReportType[]>([]);
	const [offset, setOffset] = useState(0);

	const detectScrolling = (event: UIEvent<HTMLDivElement>) => {
		const element = event.target! as HTMLDivElement;
		if (element.scrollHeight - element.scrollTop === element.clientHeight) {
			axios.post(`${api_url}/mod/get-reports`, {
				token: localStorage.getItem("auth_token"),
				offset,
			}).then(async res => {
				setReports(reports.concat(res.data.reports as ReportType[]));
				setOffset(res.data.offset);
			});
		}
	};

	const refresh = async () => {
		const tst = toast("Refreshing reports", {
			icon: Icons.spinner,
			progressStyle: {
				backgroundColor: "yellow",
			},
			theme: "dark",
			hideProgressBar: true,
		});

		const res = await axios.post(`${api_url}/mod/get-reports`, {
			token: localStorage.getItem("auth_token"),
			offset: 0,
		});

		setReports(res.data.reports);
		setOffset(res.data.offset);

		toast("Refreshed the reports", {
			icon: Icons.success,
			progressStyle: {
				backgroundColor: "yellow",
			},
			theme: "dark",
		});
		toast.dismiss(tst);
	};

	useEffect(() => {
		(async () => {
			const data = (await GetUserData()).user;
			setMe(data);

			if (data.moderator || data.owner) {
			} else return navigate("/");

			const res = await axios.post(`${api_url}/mod/get-reports`, {
				token: localStorage.getItem("auth_token"),
				offset,
			});

			setReports(res.data.reports);
			setOffset(res.data.offset);
		})();
	}, []);

	return (
		<>
			<Navigate
				isOpen={isOpen}
				setOpen={setOpen}
			/>
			<DisplayReports
				refresh={refresh}
				isOpen={isOpen}
				detectScrolling={detectScrolling}
				reports={reports}
			/>
		</>
	);
}

export default Reports;
