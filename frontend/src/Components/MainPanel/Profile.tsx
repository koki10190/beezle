import { useParams } from "react-router-dom";
import GetOtherUser from "../../api/GetOtherUser";
import { useEffect, useRef } from "react";
import UserType from "../../interfaces/UserType";
import "./Profile.css";

function Profile() {
	const { handle } = useParams();
	let user: UserType;

	const username = useRef<HTMLHeadingElement>(null);
	const tag = useRef<HTMLHeadingElement>(null);
	const bio = useRef<HTMLHeadingElement>(null);
	const avatar = useRef<HTMLDivElement>(null);
	const banner = useRef<HTMLDivElement>(null);

	useEffect(() => {
		(async () => {
			user = (await GetOtherUser(handle!)).user;

			username.current!.textContent = user.displayName;
			tag.current!.textContent = "@" + user.handle;
			bio.current!.textContent = user.bio;
			avatar.current!.style.backgroundImage = `url("${user.avatar}")`;
			banner.current!.style.backgroundImage = `url("${user.banner}")`;
		})();
	}, []);

	return (
		<div className="navigation-panel">
			<div ref={banner} className="banner"></div>
			<div ref={avatar} className="avatar"></div>
			<h1 ref={username} className="profile-name">
				NAME
			</h1>
			<h3 ref={tag} className="profile-handle">
				@user
			</h3>
			<p ref={bio} className="profile-bio">
				Lorem, ipsum dolor sit amet consectetur
				adipisicing elit. Architecto incidunt,
				eum facilis doloremque sequi delectus
				rem minima mollitia qui illum itaque
				nemo officia commodi placeat omnis
				cumque soluta, blanditiis esse obcaecati
				ipsam! Autem perspiciatis ducimus at rem
				aliquam omnis ad sapiente voluptas
				laudantium aut nulla aperiam unde quasi
				quas, exercitationem ipsam repudiandae
				quibusdam! Sequi qui pariatur illum
				dolorem vitae eos nemo harum ex nihil,
				repellat velit eligendi perferendis
				commodi ipsum cupiditate quas
				consequuntur magnam enim, dolorum
				facilis obcaecati. Tenetur assumenda
				odio eius quod facilis sequi saepe
				voluptatum, velit sapiente, quo,
				dignissimos est. Eveniet odit enim
				doloremque, esse neque amet animi?
			</p>
		</div>
	);
}

export default Profile;
