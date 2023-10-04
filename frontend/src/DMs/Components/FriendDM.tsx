import { useEffect, useState } from "react";
import UserType from "../../interfaces/UserType";
import GetOtherUser from "../../api/GetOtherUser";
import VerifyBadgeText from "../../functions/VerifyBadgeText";
import styles from "../DMs2.module.css";

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
			if (!data) setError(true);
			console.log("Check: " + data!.user);
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
							className={styles["dm-friend-avatar"]}
						></div>
						<p
							className={styles["dm-friend-name"]}
							dangerouslySetInnerHTML={{
								__html: VerifyBadgeText(user!),
							}}
						></p>
						<p className={styles["dm-friend-handle"]}>@{user?.handle}</p>
						{user?.activity != "" ? (
							<p
								style={{
									color: "rgba(255,255,255,0.8)",
									marginTop: "-15px",
								}}
								className={styles["dm-friend-handle"]}
							>
								{user?.activity}
							</p>
						) : (
							<></>
						)}
					</>
				)}
			</>
		);
	};

	return (
		<div
			onClick={() => changeDM(handle)}
			className={styles["dm-friend"]}
		>
			{user ? user_info() : ""}
		</div>
	);
}

export default FriendDM;
