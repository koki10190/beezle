import { useParams } from "react-router-dom";
import GetOtherUser from "../../api/GetOtherUser";
import { FormEvent, useEffect, useRef } from "react";
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
	const aboutMe = useRef<HTMLTextAreaElement>(null);
	const displayName = useRef<HTMLInputElement>(null);

	const formDataAvatar = new FormData();
	const formDataBanner = new FormData();
	useEffect(() => {
		(async () => {
			user = (await GetUserData()).user;
			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			banner.current!.style.backgroundImage = `url("${user.banner}")`;
			aboutMe.current!.innerText = user.bio;
			displayName.current!.value = user.displayName;
		})();

		avatarInput.current!.addEventListener("change", (event: Event) => {
			const link = window.URL.createObjectURL(
				avatarInput.current!.files![0]
			);
			avatar.current!.style.backgroundImage = `url("${link}")`;
			formDataAvatar.append(
				"avatar",
				avatarInput.current!.files![0]
			);

			const split =
				avatarInput.current!.files![0].name.split(
					"."
				);
			const ext = split[split.length - 1];
			formDataAvatar.append("ext", ext);
			formDataAvatar.append(
				"token",
				localStorage.getItem(
					"auth_token"
				) as string
			);
			// axios.post(
			// 	"http://localhost:3000/api/upload-avatar",
			// 	formData,
			// 	{
			// 		headers: {
			// 			"Content-Type": "multipart/form-data",
			// 		},
			// 	}
			// );
		});

		bannerInput.current!.addEventListener("change", (event: Event) => {
			const link = window.URL.createObjectURL(
				bannerInput.current!.files![0]
			);
			banner.current!.style.backgroundImage = `url("${link}")`;

			formDataBanner.append(
				"banner",
				bannerInput.current!.files![0]
			);

			const split =
				bannerInput.current!.files![0].name.split(
					"."
				);
			const ext = split[split.length - 1];
			formDataBanner.append("ext_banner", ext);
			formDataBanner.append(
				"token",
				localStorage.getItem(
					"auth_token"
				) as string
			);
			// axios.post(
			// 	"http://localhost:3000/api/upload-banner",
			// 	formData,
			// 	{
			// 		headers: {
			// 			"Content-Type": "multipart/form-data",
			// 		},
			// 	}
			// );
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

	const saveChanges = (event: FormEvent) => {
		event.preventDefault();
		axios.post(
			"http://localhost:3000/api/upload-banner",
			formDataBanner,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		axios.post(
			"http://localhost:3000/api/upload-avatar",
			formDataAvatar,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		axios.post("http://localhost:3000/api/edit-profile", {
			displayName: displayName.current!.value as string,
			bio: aboutMe.current!.value as string,
			token: localStorage.getItem("auth_token") as string,
		}).then(res => {
			if (!res.data.error) {
				setTimeout(() => {
					window.location.href = `/profile/${user.handle}`;
				}, 1000);
			}
		});
	};

	return (
		<div className="navigation-panel edit-profile">
			<h1>Edit Profile</h1>
			<br />
			<form onSubmit={saveChanges}>
				<div
					style={{
						borderRadius: "15px",
					}}
					ref={banner}
					onClick={changeBanner}
					className="banner-edit"
				></div>
				<input
					accept=".gif,.jpg,.jpeg,.png,.webp"
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
					accept=".gif,.jpg,.jpeg,.png,.webp"
					name="avatarfile"
					className="hidden-input"
				/>

				<label>Display Name</label>
				<input
					ref={displayName}
					placeholder="Name"
					name="display-name"
					required
					className="form-control"
				/>

				<label>Bio (About Me)</label>
				<textarea
					ref={aboutMe}
					style={{
						height: "150px",
					}}
					placeholder="Write stuff about you here!"
					name="bio"
					className="form-control"
				></textarea>

				<button
					type="submit"
					className="button"
				>
					Save Changes
				</button>
			</form>
		</div>
	);
}

export default EditProfile;
