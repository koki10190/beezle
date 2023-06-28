import "./Welcome.css";

function Welcome() {
	return (
		<>
			<nav>
				<div className="icon"></div>
			</nav>
			<div>
				<header>
					<h1>Beezle</h1>
					<h3>
						An
						upcoming
						social
						media
						platform
					</h3>
				</header>
				<div className="other-side">
					<form className="welcome-form-registration"></form>
				</div>
			</div>
		</>
	);
}

export default Welcome;
