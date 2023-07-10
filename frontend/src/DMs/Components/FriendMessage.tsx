import { useEffect, useState } from "react";
import UserType from "../../interfaces/UserType";
import GetOtherUser from "../../api/GetOtherUser";
import VerifyBadgeText from "../../functions/VerifyBadgeText";

interface FriendType {
	handle: string;
	avatar: string;
	name: string;
	content: string;
	me: boolean;
}

function FriendMessage({ handle, avatar, name, content, me }: FriendType) {
	return (
		<div className={me || handle === localStorage.getItem("handle") ? "dm-msg-right" : "dm-msg"}>
			<div
				style={{ backgroundImage: `url("${avatar}")` }}
				className="dm-friend-avatar"
			></div>

			<p className="dm-friend-name">{name}</p>
			<p className="dm-friend-handle">@{handle}</p>
			<p
				dangerouslySetInnerHTML={{
					__html: content,
				}}
				className="dm-content"
			></p>
		</div>
	);
}

export default FriendMessage;
