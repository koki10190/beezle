import { useState, useEffect, useRef } from "react";
import GetUserData from "../api/GetUserData";
import NavigationPanel from "../Components/NavigationPanel";
import InfoPanel from "../Components/InfoPanel";
import UserType from "../interfaces/UserType";
import "./HomeSearch.css";
import axios from "axios";
import { api_url } from "../constants/ApiURL";
import { PostBoxType } from "../interfaces/PostType";
import PostBox from "../Components/MainPanel/PostBox";
import getBadgeType from "../functions/getBadgeType";

function HomeSearch() {
	const [user, setUser] = useState<UserType>({} as UserType);
	const [isSearching, setSearching] = useState<boolean>(false);
	const [posts, setPosts] = useState<PostBoxType[]>([] as PostBoxType[]);
	const toSearch = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		(async () => {
			setUser((await GetUserData()).user);
		})();
	}, []);

	const search = async () => {
		setSearching(true);
		setPosts([]);
		const results = (
			await axios.post(`${api_url}/api/search`, {
				toSearch: toSearch.current!.value,
				token: localStorage.getItem("auth_token"),
			})
		).data as PostBoxType[];
		setSearching(false);
		setPosts(results);
	};

	return (
		<>
			<div className="main-pages">
				<InfoPanel />
				<div className="navigation-panel main-panel search-panel">
					<div className="post-text-box">
						<textarea
							ref={toSearch}
							style={{
								fontSize: "20px",
								minHeight: "70px",
							}}
							placeholder="Press here to search"
							className="post-textarea"
						></textarea>
						<hr
							style={{
								marginBottom: "25px",
							}}
							className="small-bar"
						/>
					</div>
					<div className="post-text-buttons">
						<button
							onClick={search}
							style={{ width: "100%" }}
						>
							Search
						</button>
					</div>
					<hr
						style={{
							marginTop: "90px",
						}}
						className="small-bar"
					/>
					{isSearching ? <h1 className="searching">Searching...</h1> : ""}

					{posts.map(item => (
						<PostBox
							activity={item.op.activity}
							edited={item.data.edited}
							avatarShape={item.op.cosmetic.avatar_shape}
							repost_id={item.data.repost_id}
							repost_op={item.data.repost_op}
							repost_type={item.data.repost_type}
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
							tokenUser={user}
						/>
					))}
				</div>
				<NavigationPanel />
			</div>
		</>
	);
}

export default HomeSearch;
