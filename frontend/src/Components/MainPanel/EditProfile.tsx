import { useNavigate, useParams } from "react-router-dom";
import GetOtherUser from "../../api/GetOtherUser";
import { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useRef, useState } from "react";
import UserType from "../../interfaces/UserType";
import "./Profile.css";
import "./EditProfile.css";
import GetUserData from "../../api/GetUserData";
import axios from "axios";
import { marked } from "marked";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { api_url } from "../../constants/ApiURL";
import { Icons, toast } from "react-toastify";
import AvatarEditor from "react-avatar-editor";

const formDataAvatar = new FormData();
const formDataBanner = new FormData();
var lastScrollTop = 0;

function EditProfile() {
	const navigate = useNavigate();
	let user: UserType;
	const [m_user, setUser] = useState<UserType>({} as any);

	const avatar = useRef<HTMLDivElement>(null);
	const [avatarEditor, setAvatarEditor] = useState<AvatarEditor | null>(null);
	const banner = useRef<HTMLDivElement>(null);

	const avatarInput = useRef<HTMLInputElement>(null);
	const bannerInput = useRef<HTMLInputElement>(null);
	const m_status = useRef<HTMLSelectElement>(null);
	const aboutMe = useRef<HTMLTextAreaElement>(null);
	const activity = useRef<HTMLInputElement>(null);
	const displayName = useRef<HTMLInputElement>(null);
	const color1 = useRef<HTMLInputElement>(null);
	const color2 = useRef<HTMLInputElement>(null);
	const saveChangesButton = useRef<HTMLButtonElement>(null);
	const [imageURL, setImageURL] = useState("/icon1.png");

	const [avatarScale, setAvatarScale] = useState(1.2);
	const [avatarRotate, setAvatarRotate] = useState(0);
	const [avatarUploaded, setAvatarUploaded] = useState(false);

	useEffect(() => {
		(async () => {
			user = (await GetUserData()).user;
			setUser(user);
			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			setImageURL(user.avatar);
			banner.current!.style.backgroundImage = `url("${user.banner}")`;
			aboutMe.current!.innerText = user.bio;
			displayName.current!.value = user.displayName;
		})();

		avatarInput.current!.addEventListener("change", (event: Event) => {
			const link = window.URL.createObjectURL(avatarInput.current!.files![0]);
			setImageURL(link);
			avatar.current!.style.backgroundImage = `url("${link}")`;
			console.log("SHENI DEDA MOVTYAN");

			const split = avatarInput.current!.files![0].name.split(".");
			const ext = split[split.length - 1];
			if (ext !== "gif") {
				setAvatarUploaded(true);
			} else {
				formDataAvatar.append("avatar", avatarInput.current!.files![0]);
			}

			formDataAvatar.append("ext", ext);
			formDataAvatar.append("token", localStorage.getItem("auth_token") as string);
			// axios.post(
			// 	"${api_url}/api/upload-avatar",
			// 	formData,
			// 	{
			// 		headers: {
			// 			"Content-Type": "multipart/form-data",
			// 		},
			// 	}
			// );
		});

		bannerInput.current!.addEventListener("change", (event: Event) => {
			const link = window.URL.createObjectURL(bannerInput.current!.files![0]);
			banner.current!.style.backgroundImage = `url("${link}")`;

			formDataBanner.append("banner", bannerInput.current!.files![0]);

			const split = bannerInput.current!.files![0].name.split(".");
			const ext = split[split.length - 1];
			formDataBanner.append("ext_banner", ext);
			formDataBanner.append("token", localStorage.getItem("auth_token") as string);
			// axios.post(
			// 	"${api_url}/api/upload-banner",
			// 	formData,
			// 	{
			// 		headers: {
			// 			"Content-Type": "multipart/form-data",
			// 		},
			// 	}
			// );
		});

		const avEditor = document.querySelector(".avatarEditor") as HTMLCanvasElement;
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
		saveChangesButton.current!.disabled = true;
		console.log(formDataBanner);
		axios.post(`${api_url}/api/upload-banner`, formDataBanner, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
			.then(res => console.log(res.status))
			.catch(err => console.log(err));

		if (avatarUploaded) {
			avatarEditor!.getImage().toBlob(blob => {
				formDataAvatar.append("avatar", blob!);
				axios.post(`${api_url}/api/upload-avatar`, formDataAvatar, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
			});
		} else {
			axios.post(`${api_url}/api/upload-avatar`, formDataAvatar, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
		}
		axios.post(`${api_url}/api/edit-profile`, {
			displayName: displayName.current!.value as string,
			bio: aboutMe.current!.value as string,
			token: localStorage.getItem("auth_token") as string,
			status: m_status.current!.value,
			activity: activity.current!.value,
			color1:
				m_user.cosmetic?.profile_colors || m_user.supporter || m_user.kofi || m_user.owner
					? color1.current!.value
					: "#000000",
			color2:
				m_user.cosmetic?.profile_colors || m_user.supporter || m_user.kofi || m_user.owner
					? color2.current!.value
					: "#000000",
		}).then(res => {
			if (!res.data.error) {
				setTimeout(() => {
					navigate(`/profile/${m_user.handle}`);
				}, 2500);
			}
		});
	};

	const buyProfileColors = async () => {
		const tst = toast("Buying item", {
			icon: Icons.spinner,
			progressStyle: {
				backgroundColor: "yellow",
			},
			theme: "dark",
			hideProgressBar: true,
		});
		const res = await axios.post(`${api_url}/buy-profile-colors`, {
			token: localStorage.getItem("auth_token"),
		});
		toast.dismiss(tst);
		if (res.data.error) return alert("There was an error when buying the item!");
		toast(res.data.msg, {
			icon: Icons.info,
			progressStyle: {
				backgroundColor: "yellow",
			},
			theme: "dark",
		});
	};

	return (
		<div className="navigation-panel main-panel edit-profile">
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
					name="banner"
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
				<div
					style={{
						display: avatarUploaded ? "flex" : "none",
					}}
					className="avatarEditorDiv"
				>
					<AvatarEditor
						ref={editor => setAvatarEditor(editor)}
						image={imageURL}
						width={250}
						height={250}
						border={50}
						borderRadius={1000000}
						color={[0, 0, 0, 0.6]} // RGBA
						scale={avatarScale}
						rotate={avatarRotate}
						className="avatarEditor"
						style={{
							borderRadius: "15px",
						}}
					/>
					<br></br>
					<label>Scale</label>
					<br />
					<input
						name="scale"
						type="range"
						min={1}
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setAvatarScale(parseFloat(e.target.value));
						}}
						value={avatarScale}
						max="5"
						step="0.01"
					/>
					<br />
					<label>Rotation</label>
					<br />
					<input
						name="scale"
						type="range"
						min={0}
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setAvatarRotate(parseFloat(e.target.value));
						}}
						value={avatarRotate}
						max="360"
						step="0.01"
					/>
					<br />
					<br />
				</div>

				<label>Display Name</label>
				<input
					ref={displayName}
					placeholder="Name"
					name="display-name"
					required
					className="form-control"
				/>

				<label>Activity</label>
				<input
					ref={activity}
					placeholder="Just Chillin'"
					name="activity"
					required
					className="form-control"
					max={200}
					defaultValue={m_user?.activity}
				/>

				<label>Status</label>
				<select
					ref={m_status}
					placeholder="Name"
					name="display-name"
					required
					className="form-control"
				>
					<option value="online">Online</option>
					<option value="dnd">Do Not Disturb</option>
					<option value="idle">Idle</option>
					<option value="offline">Offline</option>
				</select>

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

				{m_user.cosmetic?.profile_colors || m_user.supporter || m_user.kofi || m_user.owner ? (
					<>
						<label>Gradient Color One</label>
						<input
							type="color"
							ref={color1}
							style={{
								height: "20px",
							}}
							defaultValue={m_user?.gradient.color1}
							placeholder="Write stuff about you here!"
							name="bio"
							className="form-control"
						></input>

						<label>Gradient Color Two</label>
						<input
							type="color"
							ref={color2}
							defaultValue={m_user?.gradient.color2}
							style={{
								height: "20px",
							}}
							placeholder="Write stuff about you here!"
							name="bio"
							className="form-control"
						></input>
					</>
				) : (
					<>
						<h1>
							Buy Profile Colors<br></br>
							<i className="fa-solid fa-coins"></i> 20,000
						</h1>
						<button
							type="button"
							className="button"
							style={{
								backgroundImage: "-webkit-linear-gradient(-15deg, #8b00fc, #db00fc)",
								color: "white",
								marginBottom: "20px",
								marginTop: "-10px",
							}}
							onClick={buyProfileColors}
						>
							Buy
						</button>
					</>
				)}

				<button
					type="submit"
					className="button"
					ref={saveChangesButton}
				>
					Save Changes
				</button>
			</form>
		</div>
	);
}

export default EditProfile;
