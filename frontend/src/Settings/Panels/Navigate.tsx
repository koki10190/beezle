import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navigate({ isOpen, setOpen }: { isOpen: boolean; setOpen: any }) {
	const navigate = useNavigate();

	return (
		<>
			<i
				onClick={() => setOpen(!isOpen)}
				className="fa-solid fa-ellipsis close-btn"
			></i>
			<div
				style={{
					display: isOpen ? "inline-flex" : "none",
				}}
				className={`navigation-panel info-panel dashboard-panel`}
			>
				<a onClick={() => navigate("/settings/privacy")}>
					<i className="fa-solid fa-lock"></i> Privacy
				</a>
				<a onClick={() => navigate("/settings/credentials")}>
					<i className="fa-solid fa-key"></i> Credentials
				</a>
				<a onClick={() => navigate("/settings/developers")}>
					<i className="fa-solid fa-square-terminal"></i> Developers
				</a>
				<a onClick={() => navigate("/home")}>
					<i className="fa-solid fa-left-long-to-line"></i> Go Back
				</a>
				<a
					style={{ color: "red" }}
					onClick={() => navigate("/settings/delete-account")}
				>
					<i className="fa-solid fa-user-minus"></i> Delete Account
				</a>
			</div>
		</>
	);
}

export default Navigate;
