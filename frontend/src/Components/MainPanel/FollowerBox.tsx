import { useEffect, useRef, useState } from "react";
import UserType from "../../interfaces/UserType";
import GetOtherUser from "../../api/GetOtherUser";
import uuid4 from "uuid4";
import VerifyBadge from "../../functions/VerifyBadge";
import VerifyBadgeText from "../../functions/VerifyBadgeText";
import { api_url } from "../../constants/ApiURL";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FollowerBoxData {
	handle: string;
}

function FollowerBox({ handle }: FollowerBoxData) {
	const navigate = useNavigate();
	const [user, setUser] = useState<UserType>({} as UserType);
	const [isFollowing, setFollowing] = useState<boolean>(false);
	const followBtn = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		(async () => {
			const user = (await GetOtherUser(handle)).user;
			setUser(user);

			if (user.followers.find(x => x === localStorage.getItem("handle"))) {
				followBtn.current!.innerHTML = "Unfollow";
				setFollowing(true);
			} else {
				followBtn.current!.innerHTML = "Follow";
				setFollowing(false);
			}
		})();
	}, []);

	const follow = () => {
		axios.post(`${api_url}/api/follow`, {
			token: localStorage.getItem("auth_token") as string,
			toFollow: handle,
			unfollow: followBtn.current!.innerText === "Unfollow" ? true : false,
		}).then(res => window.location.reload());
	};

	return (
		<div
			key={uuid4()}
			className="follower-box"
		>
			<div
				onClick={() => navigate("/profile/" + handle)}
				className="follower-data"
			>
				<div
					style={{
						backgroundImage: `url("${user.avatar}")`,
					}}
					className="follower-avatar"
				></div>
				<p
					dangerouslySetInnerHTML={{
						__html: VerifyBadgeText(user),
					}}
					className="follower-name"
				></p>
				<p className="follower-handle">@{user.handle}</p>
				<p
					className="follower-bio"
					dangerouslySetInnerHTML={{
						__html: user.bio,
					}}
				></p>
			</div>
			<button
				ref={followBtn}
				onClick={follow}
				style={{ marginTop: "0px", width: "100%" }}
				className="followbox"
			>
				{isFollowing ? "Unfollow" : "Follow"}
			</button>
		</div>
	);
}

export default FollowerBox;
