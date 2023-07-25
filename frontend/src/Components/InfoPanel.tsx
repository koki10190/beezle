import FollowerBox from "./MainPanel/FollowerBox";
import "./navigation.css";

function InfoPanel() {
	return (
		<div className="navigation-panel info-panel">
			<div className="info-div">
				<h1>
					<span className="gradient">Beezle</span> ALPHA v1.0 (TEST RELEASE)
				</h1>
				<h2>
					This is an alpha release!
					<br />
					<br />
					If you find any bugs, please create an issue{" "}
					<a
						className="link"
						target="_blank"
						href="https://github.com/koki10190/beezle"
					>
						here
					</a>
					<br></br>
					<br></br>
					Read Privacy & Terms{" "}
					<a
						href="https://425d-95-83-232-242.ngrok-free.app/privacy-and-terms"
						target="_blank"
						className="link"
					>
						here
					</a>
				</h2>
				<br></br>
				<h1>Who to follow</h1>
				<FollowerBox handle="koki" />
				<FollowerBox handle="beezle" />
			</div>
		</div>
	);
}

export default InfoPanel;
