import { useNavigate } from "react-router-dom";
import VerifyBadgeText from "../../functions/VerifyBadgeText";
import UserType from "../../interfaces/UserType";
import axios from "axios";
import { api_url } from "../../constants/ApiURL";

interface ReportBoxArgs {
	user: UserType;
	postID: string;
	refresh: any;
}

function ReportBox({ user, postID, refresh }: ReportBoxArgs) {
	const navigate = useNavigate();

	const resolve = async () => {
		const res = await axios.post(`${api_url}/mod/resolve`, {
			token: localStorage.getItem("auth_token"),
			postID,
			reporter: user.handle,
		});
		refresh();
	};

	return (
		<div className="report-box">
			<div
				style={{
					backgroundImage: `url("${user.avatar}")`,
				}}
				className="report-avatar"
			></div>
			<p
				dangerouslySetInnerHTML={{
					__html: VerifyBadgeText(user),
				}}
				className="report-name"
			></p>
			<p className="report-handle">@{user.handle}</p>
			<p
				onClick={() => window.open("/post/" + postID)}
				className="report-id"
			>
				<strong>@{user.handle}</strong> has reported the post: {postID}
				<br />
				Click here to see the post
			</p>
			<button
				onClick={resolve}
				className="followbox report-btn"
			>
				Mark As Resolved
			</button>
		</div>
	);
}

export default ReportBox;
