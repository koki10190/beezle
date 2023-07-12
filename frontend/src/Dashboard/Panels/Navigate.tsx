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
				<a onClick={() => navigate("/dashboard/reports")}>
					<i className="fa-solid fa-flag"></i> Reports
				</a>
				<a onClick={() => navigate("/dashboard/delete-post")}>
					<i className="fa-solid fa-trash"></i> Delete Post
				</a>
				<a onClick={() => navigate("/dashboard/ban")}>
					<i className="fa-solid fa-gavel"></i> Ban User
				</a>
				<a onClick={() => navigate("/dashboard/verify")}>
					<i className="fa-solid fa-badge-check"></i> Verify (NEED PERM)
				</a>
			</div>
		</>
	);
}

export default Navigate;
