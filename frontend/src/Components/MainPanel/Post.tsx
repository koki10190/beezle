import { useEffect } from "react";
import "./Post.css";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import PostBox from "./PostBox";

function Post() {
	let user: UserType;

	useEffect(() => {
		(async () => {
			user = (await GetUserData()).user;
		})();
	}, []);

	return (
		<div className="navigation-panel make-post">
			<textarea
				placeholder="What's on your mind?"
				className="form-control"
			></textarea>
			<hr
				style={{ boxSizing: "content-box" }}
				className="small-bar"
			/>
		</div>
	);
}

export default Post;
