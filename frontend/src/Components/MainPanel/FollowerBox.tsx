import { useEffect, useRef, useState } from "react";
import UserType from "../../interfaces/UserType";
import GetOtherUser from "../../api/GetOtherUser";
import uuid4 from "uuid4";
import VerifyBadge from "../../functions/VerifyBadge";
import VerifyBadgeText from "../../functions/VerifyBadgeText";

interface FollowerBoxData {
	handle: string;
}

function FollowerBox({ handle }: FollowerBoxData) {
	const [user, setUser] = useState({} as any as UserType);

	(async () => {
		setUser((await GetOtherUser(handle)).user);
	})();

	return (
		<div key={uuid4()} className="follower-box">
			<div
				onClick={() =>
					(window.location.href =
						"/profile/" +
						user.handle)
				}
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
						__html: VerifyBadgeText(
							user
						),
					}}
					className="follower-name"
				></p>
				<p className="follower-handle">
					@{user.handle}
				</p>
			</div>
			<p
				className="follower-bio"
				dangerouslySetInnerHTML={{
					__html: user.bio,
				}}
			></p>
		</div>
	);
}

export default FollowerBox;
