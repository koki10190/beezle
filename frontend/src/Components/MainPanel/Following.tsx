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

function Following() {
	const [following, setFollowing] = useState([] as string[]);
	const { handle } = useParams();

	(async () => {
		setFollowing((await GetOtherUser(handle as string)).user.following);
	})();

	return (
		<div className="navigation-panel main-panel followers-panel">
			<h1>Following</h1>
			<hr className="small-bar" />
			{following.map(follower => (
				<FollowerBox handle={follower} />
			))}
		</div>
	);
}

export default Following;
