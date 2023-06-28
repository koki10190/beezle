import "./navigation.css";

function NavigationPanel() {
	return (
		<div className="navigation-panel nav-pad-right">
			<div className="icon"></div>
			<h1>
				<i className="fa-solid fa-house"></i>{" "}
				Home
			</h1>
			<h1>
				<i className="fa-solid fa-magnifying-glass"></i>{" "}
				Explore
			</h1>
			<h1>
				<i className="fa-solid fa-bell"></i>{" "}
				Notifications
			</h1>
			<h1>
				<i className="fa-solid fa-bookmark"></i>{" "}
				Bookmarks
			</h1>
			<h1>
				<i className="fa-solid fa-user"></i>{" "}
				Profile
			</h1>
		</div>
	);
}

export default NavigationPanel;
