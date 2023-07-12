import { useEffect, useState, UIEvent } from "react";
import NavigationPanel from "../../Components/NavigationPanel";
import Display from "../Panels/Display";
import Navigate from "../Panels/Navigate";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";
import { useNavigate } from "react-router-dom";
import { ReportType } from "./ReportType";
import ReportBox from "./ReportBox";
import axios from "axios";
import { api_url } from "../../constants/ApiURL";
import { Icons, toast } from "react-toastify";
import uuid4 from "uuid4";
function DisplayDeletePost({ isOpen, setPostID, deletePost }: { isOpen: boolean; setPostID: any; deletePost: any }) {
	return (
		<>
			<div className={`navigation-panel ${!isOpen ? "display-panel-full" : "display-panel"} main-panel`}>
				<h1>Delete post by ID</h1>
				<input
					className="post-edit-textarea"
					onChange={(ev: any) => setPostID(ev.target.value)}
					placeholder="Type the ID of the post to delete."
				></input>
				<button
					onClick={() => deletePost()}
					className="post-edit-save"
				>
					Delete Post
				</button>
			</div>
		</>
	);
}
function DeletePost() {
	const navigate = useNavigate();
	const [me, setMe] = useState({} as UserType);
	const [isOpen, setOpen] = useState(true);
	const [postID, setPostID] = useState("");

	useEffect(() => {
		(async () => {
			const data = (await GetUserData()).user;
			setMe(data);

			if (data.moderator || data.owner) {
			} else return navigate("/");
		})();
	}, []);

	const deletePost = async () => {
		console.log(postID);
		const tst = toast("Deleting post", {
			icon: Icons.spinner,
			progressStyle: {
				backgroundColor: "yellow",
			},
			theme: "dark",
			hideProgressBar: true,
		});
		const res = await axios.post(`${api_url}/mod/delete-post`, {
			token: localStorage.getItem("auth_token"),
			postID: postID,
		});

		if (res.data.error) {
			toast.dismiss(tst);
			toast("There was an error when deleting the post", {
				icon: Icons.error,
				progressStyle: {
					backgroundColor: "yellow",
				},
				theme: "dark",
				hideProgressBar: false,
			});
		} else {
			toast("The post has been deleted successfully", {
				icon: Icons.error,
				progressStyle: {
					backgroundColor: "yellow",
				},
				theme: "dark",
				hideProgressBar: false,
			});
		}
	};

	return (
		<>
			<Navigate
				isOpen={isOpen}
				setOpen={setOpen}
			/>
			<DisplayDeletePost
				isOpen={isOpen}
				setPostID={setPostID}
				deletePost={deletePost}
			/>
		</>
	);
}

export default DeletePost;
