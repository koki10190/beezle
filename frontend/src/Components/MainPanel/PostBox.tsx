import { useEffect } from "react";
import UserType from "../../interfaces/UserType";
import GetUserData from "../../api/GetUserData";

interface PostBoxInterface {
	name: string;
	avatarURL: string;
	date: string;
}

function PostBox({ name, avatarURL, date }: PostBoxInterface) {
	return (
		<div className="post-box">
			<div className="user-stuff">
				<div
					style={{
						backgroundImage: `url("${avatarURL}")`,
					}}
					className="post-avatar"
				></div>
				<p className="post-name">{name}</p>
				<p className="post-date">{date}</p>
				<p>
					Lorem ipsum dolor sit
					amet consectetur
					adipisicing elit. Illum
					reprehenderit explicabo
					laudantium nesciunt nihil
					autem animi dignissimos
					impedit sapiente, odit
					possimus, est magnam ad
					ut facere dolorem ducimus
					eligendi exercitationem
					dicta. Voluptatem saepe
					dolor voluptates odio
					repudiandae rem ut
					dolorem iure, voluptatum
					ratione fugiat
					perspiciatis explicabo
					consequuntur optio
					repellendus corrupti
					eligendi nam fugit eius
					quo blanditiis porro
					neque. Ducimus eos
					nostrum cum veritatis
					dolorum dolor laudantium.
					Delectus dolore, itaque
					fuga excepturi tempora
					animi quaerat? Eos
					adipisci incidunt
					reiciendis, vero
					veritatis rerum voluptate
					illo aliquid architecto
					dolor, in, repudiandae
					non! Voluptatibus cumque
					quidem sed nam voluptatem
					accusantium, deserunt
					adipisci iusto mollitia.
				</p>
			</div>
		</div>
	);
}

export default PostBox;
