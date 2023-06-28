import GetUserData from "../api/GetUserData";
import "./navigation.css";

function NavigationPanel() {
	const logout = () => {
		localStorage.removeItem("auth_token");
		window.location.reload();
	};

	const myProfile = async () => {
		const data = (await GetUserData()).user;

		window.location.href = `/profile/${data.handle}`;
	};

	const post = async () => {
		window.location.href = `/post`;
	};

	return (
		<div className="navigation-panel nav-pad-right">
			<div className="icon"></div>
			<a>
				Home{" "}
				<i className="fa-solid fa-house"></i>
			</a>
			<a>
				Notifications{" "}
				<i className="fa-solid fa-bell"></i>
			</a>
			<a>
				Explore{" "}
				<i className="fa-solid fa-magnifying-glass"></i>
			</a>
			<a>
				Bookmarks{" "}
				<i className="fa-solid fa-bookmark"></i>
			</a>
			<a onClick={myProfile}>
				Profile{" "}
				<i className="fa-solid fa-user"></i>
			</a>
			<a onClick={post}>
				Post{" "}
				<i className="fa-solid fa-pencil"></i>
			</a>
			<a onClick={logout} style={{ color: "red" }}>
				Log Out{" "}
				<i className="fa-solid fa-right-from-bracket"></i>
			</a>
		</div>
	);
}

export default NavigationPanel;
