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
					<form className="welcome-form-registration form-group">
						<input
							placeholder="Username"
							className="form-control"
						/>
						<p>
							Only
							letters,
							numbers,
							dots,
							and
							underscores
							are
							allowed.
						</p>

						<input
							placeholder="E-Mail Address"
							className="form-control"
						/>
						<input
							placeholder="Password"
							className="form-control"
							type="password"
						/>
						<input
							placeholder="Confirm Password"
							className="form-control"
							type="password"
						/>
						<button type="submit">
							REGISTER
						</button>
					</form>
				</div>
			</div>
		</>
	);
}

export default Welcome;
