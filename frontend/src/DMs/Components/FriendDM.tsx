import { useEffect, useState } from "react";
import UserType from "../../interfaces/UserType";
import GetOtherUser from "../../api/GetOtherUser";
import VerifyBadgeText from "../../functions/VerifyBadgeText";

interface FriendType {
	handle: string;
	changeDM: (handle: string) => void;
}

function FriendDM({ handle, changeDM }: FriendType) {
	const [user, setUser] = useState<UserType>();
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const data = await GetOtherUser(handle);
			setUser(data!.user);
		})();
	}, []);

	const user_info = () => {
		return (
			<>
				{error ? (
					""
				) : (
					<>
						<div
							style={{
								backgroundImage: `url("${user?.avatar}")`,
							}}
							className="dm-friend-avatar"
						></div>
						<p
							className="dm-friend-name"
							dangerouslySetInnerHTML={{
								__html: VerifyBadgeText(user!),
							}}
						></p>
						<p className="dm-friend-handle">@{user?.handle}</p>
					</>
				)}
			</>
		);
	};

	return (
		<div
			onClick={() => changeDM(handle)}
			className="dm-friend"
		>
			{user ? user_info() : ""}
		</div>
	);
}

export default FriendDM;
