import { useParams } from "react-router-dom";
import GetOtherUser from "../../api/GetOtherUser";
import { useEffect, useRef, useState } from "react";
import UserType from "../../interfaces/UserType";
import "./Profile.css";
import "./Followers.css";
import VerifyBadge from "../../functions/VerifyBadge";
import { PostBoxType, PostType } from "../../interfaces/PostType";
import axios from "axios";
import PostBox from "./PostBox";
import { api_url } from "../../constants/ApiURL";
import GetUserData from "../../api/GetUserData";
import FollowerBox from "./FollowerBox";

function Followers() {
	const [followers, setFollowers] = useState([] as string[]);
	const { handle } = useParams();

	(async () => {
		setFollowers((await GetOtherUser(handle as string))!.user.followers);
	})();

	return (
		<div className="navigation-panel main-panel followers-panel">
			<h1>Followers</h1>
			<hr className="small-bar" />
			{followers.map(follower => (
				<FollowerBox handle={follower} />
			))}
		</div>
	);
}

export default Followers;
