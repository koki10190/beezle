import "./navigation.css";

function InfoPanel() {
	return (
		<div className="navigation-panel info-panel">
			<div className="info-div">
				<h1>
					<span className="gradient">
						Beezle
					</span>{" "}
					BETA v0.1
				</h1>
				<h2>
					This is a beta release!
					<br />
					<br />
					If you find any bugs,
					please create an issue{" "}
					<a
						className="link"
						target="_blank"
						href="https://github.com/koki10190/beezle"
					>
						here
					</a>
				</h2>
			</div>
		</div>
	);
}

export default InfoPanel;
