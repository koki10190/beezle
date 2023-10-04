import uuid4 from "uuid4";

const displayContent = (content: string, postID: string = ""): string => {
	let txt = content.replace(/@([a-z\d_\.-]+)/gi, `<a id="${"$1".replace("@", "")}-${postID}" class="mention" href="/profile/$1">@$1</a>`);
	txt = txt.replace(/#([a-z\d_\.-]+)/gi, `<a id="${"$1".replace("#", "ht")}-${postID}" class="mention" href="/tag/$1">#$1</a>`);

	const matched = txt.match(/(https?:\/\/.*\.(?:png|gif|webp|jpeg|jpg))/i);
	const nID = uuid4();
	if (matched) {
		const img = new Image();
		img.onload = () => {
			const element = document.getElementById(nID) as HTMLDivElement;
			if (element) element.style.height = `${img.naturalHeight > 500 ? 500 : img.naturalHeight}px`;
		};
		img.src = matched[0];
	}
	txt = txt.replace(
		/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif|webp))/gi,
		`<div id="${nID}" style="background-image: url($1); " class="postImage"><a class="download-img" href="$1" download target="_blank"><i class="fa-solid fa-download"></i></a></div>`
	);

	const matched_video = txt.match(/(https?:\/\/.*\.(webm|mp4|mov))/gi);

	txt = txt.replace(
		/([a-z\-_0-9\/\:\.]*\.(webm|mp4|mov))/gi,
		`<video class="post-video" src="$1" controls>Your browser does not support the video tag.</video>`
	);

	txt = txt.replace(
		/([a-z\-_0-9\/\:\.]*\.(ogg|wav|mp3))/gi,
		`<audio class="post-audio" src="$1" controls>Your browser does not support the audio tag.</audio>`
	);

	if (txt.match(/youtube\.com|youtu\.be/g)) {
		txt = txt.replace(
			/(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/g,
			`<iframe style="width: 100%; min-height: 350px; border: none;" src="https://youtube.com/embed/$1"></iframe>`
		);
	}

	// if (txt.match(/\[(.*?)\]/g)) {
	// 	txt = txt.replace(
	// 		/\[(.*?)\]/g,
	// 		`<iframe src="$1" style="width: 100%; min-height: 350px; border: none;" height="200" width="300"  title="description"></iframe>`
	// 	);
	// }

	const element = document.getElementById(nID) as HTMLDivElement;
	if (element) {
		element.addEventListener("click", (event: Event) => {});
	}

	return txt;
};

export default displayContent;
