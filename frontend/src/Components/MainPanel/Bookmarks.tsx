import { useParams } from "react-router-dom";
import GetOtherUser from "../../api/GetOtherUser";
import { useEffect, useRef, useState, UIEvent } from "react";
import UserType from "../../interfaces/UserType";
import "./Profile.css";
import "./Followers.css";
import axios from "axios";
import { PostBoxType } from "../../interfaces/PostType";
import { api_url } from "../../constants/ApiURL";
import PostBox from "./PostBox";
import { BadgeType } from "../../functions/VerifyBadgeBool";
import GetUserData from "../../api/GetUserData";
import uuid4 from "uuid4";
import getBadgeType from "../../functions/getBadgeType";

function Bookmarks() {
	const [user, setUser] = useState<UserType>();
	const [bookmarks, setBookmarks] = useState<PostBoxType[]>([]);
	const [offset, setOffset] = useState(0);
	const { handle } = useParams();

	useEffect(() => {
		(async () => {
			setUser((await GetUserData()).user);
			const data = (
				await axios.post(`${api_url}/api/get-bookmarks`, {
					token: localStorage.getItem("auth_token"),
					offset,
				})
			).data;
			setBookmarks(data.bookmarks as PostBoxType[]);
			setOffset(data.offset as number);
		})();
	}, []);

	const detectScrolling = (event: UIEvent<HTMLDivElement>) => {
		const element = event.target! as HTMLDivElement;
		if (element.scrollHeight - element.scrollTop === element.clientHeight) {
			axios.post(`${api_url}/api/get-bookmarks`, {
				token: localStorage.getItem("auth_token"),
				offset: offset + 1,
			}).then(async res => {
				setBookmarks(bookmarks.concat(res.data.bookmarks));

				setOffset(res.data.offset);
				console.log(`Offset: ${res.data.offset}`);
			});
		}
	};

	return (
		<div
			onScroll={detectScrolling}
			className="navigation-panel main-panel followers-panel"
		>
			<h1>Bookmarks</h1>
			<hr className="small-bar" />

			{bookmarks.length <= 0
				? "You do not have any posts bookmarked."
				: bookmarks.map(item => (
						<PostBox 
rep={item.op.reputation}
							activity={item.op.activity}
							edited={item.data.edited}
							avatarShape={item.op.cosmetic.avatar_shape}
							repost_type={item.data.repost_type}
							repost_id={item.data.repost_id}
							repost_op={item.data.repost_op}
							badgeType={getBadgeType(item.op)}
							reply_type={item.data.reply_type}
							replyingTo={item.data.replyingTo}
							key={item.data.postID}
							date={item.data.date}
							postId={item.data.postID}
							name={item.op.displayName}
							handle={item.op.handle}
							avatarURL={item.op.avatar}
							content={item.data.content}
							likes={item.data.likes}
							reposts={item.data.reposts}
							replies={item.data.replies}
							tokenUser={user!}
						/>
				  ))}
		</div>
	);
}

export default Bookmarks;
