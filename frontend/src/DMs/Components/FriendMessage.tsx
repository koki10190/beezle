import { useEffect, useState } from "react";
import UserType from "../../interfaces/UserType";
import GetOtherUser from "../../api/GetOtherUser";
import VerifyBadgeText from "../../functions/VerifyBadgeText";
import styles from "../DMs2.module.css";

interface FriendType {
	handle: string;
	avatar: string;
	name: string;
	content: string;
	me: boolean;
}

function FriendMessage({ handle, avatar, name, content, me }: FriendType) {
	return (
		<div className={styles["dm-msg"]}>
			<div
				style={{ backgroundImage: `url("${avatar}")` }}
				className={styles["dm-friend-avatar"]}
			></div>

			<p className={styles["dm-friend-name"]}>{name}</p>
			<p className={styles["dm-friend-handle"]}>@{handle}</p>
			<p
				dangerouslySetInnerHTML={{
					__html: content,
				}}
				className={styles["dm-content"]}
			></p>
		</div>
	);
}

export default FriendMessage;
