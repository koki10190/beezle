import { useParams } from "react-router-dom";
import GetOtherUser from "../../api/GetOtherUser";
import { useEffect, useRef } from "react";
import UserType from "../../interfaces/UserType";
import "./Profile.css";
import "./EditProfile.css";
import GetUserData from "../../api/GetUserData";
import axios from "axios";

function EditProfile() {
	let user: UserType;

	const avatar = useRef<HTMLDivElement>(null);
	const banner = useRef<HTMLDivElement>(null);

	const avatarInput = useRef<HTMLInputElement>(null);
	const bannerInput = useRef<HTMLInputElement>(null);

	useEffect(() => {
		(async () => {
			user = (await GetUserData()).user;
			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			banner.current!.style.backgroundImage = `url("${user.banner}")`;
		})();

		avatarInput.current!.addEventListener("change", (event: Event) => {
			const link = window.URL.createObjectURL(
				avatarInput.current!.files![0]
			);
			avatar.current!.style.backgroundImage = `url("${link}")`;
			const formData = new FormData();
			formData.append(
				"avatar",
				avatarInput.current!.files![0]
			);

			const split =
				avatarInput.current!.files![0].name.split(
					"."
				);
			const ext = split[split.length - 1];
			formData.append("ext", ext);
			axios.post(
				"http://localhost:3000/api/upload-avatar",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
		});

		bannerInput.current!.addEventListener("change", (event: Event) => {
			const link = window.URL.createObjectURL(
				bannerInput.current!.files![0]
			);
			banner.current!.style.backgroundImage = `url("${link}")`;
		});
	}, []);

	const changeAvatar = () => {
		const input = avatarInput.current!;
		input.click();
	};

	const changeBanner = () => {
		const input = bannerInput.current!;
		input.click();
	};

	return (
		<div className="navigation-panel edit-profile">
			<h1>Edit Profile</h1>
			<hr />
			<br />
			<form>
				<div
					style={{
						borderRadius: "15px",
					}}
					ref={banner}
					onClick={changeBanner}
					className="banner-edit"
				></div>
				<input
					ref={bannerInput}
					type="file"
					name="bannerfile"
					className="hidden-input"
				/>

				<div
					onClick={changeAvatar}
					style={{
						marginBottom: "50px",
					}}
					ref={avatar}
					className="avatar-edit"
				></div>
				<input
					ref={avatarInput}
					type="file"
					name="avatarfile"
					className="hidden-input"
				/>

				<label>Display Name</label>
				<input
					placeholder="Name"
					name="display-name"
					className="form-control"
				/>
			</form>
		</div>
	);
}

export default EditProfile;
