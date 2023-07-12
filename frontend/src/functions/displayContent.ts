import uuid4 from "uuid4";

const displayContent = (content: string): string => {
	let txt = content.replace(/@([a-z\d_\.-]+)/gi, `<a class="mention" href="/profile/$1">@$1</a>`);

	const matched = txt.match(/(https?:\/\/.*\.(?:png|gif|webp|jpeg|jpg))/i);
	const nID = uuid4();
	if (matched) {
		const img = new Image();
		img.onload = () => {
			const element = document.getElementById(nID) as HTMLDivElement;

			element.style.height = `${img.naturalHeight > 500 ? 500 : img.naturalHeight}px`;
		};
		img.src = matched[0];
	}
	txt = txt.replace(
		/(https?:\/\/.*\.(?:png|gif|webp|jpeg|jpg))/i,
		`<div id="${nID}" style="background-image: url($1); " class="postImage"><a class="download-img" href="$1" download target="_blank"><i class="fa-solid fa-download"></i></a></div>`
	);

	const matched_video = txt.match(/(https?:\/\/.*\.(?:webm|mp4|mov))/i);

	txt = txt.replace(
		/(https?:\/\/.*\.(?:webm|mp4|mov))/i,
		`<video class="post-video" src="$1" controls>Your browser does not support the video tag.</video>`
	);

	txt = txt.replace(
		/(https?:\/\/.*\.(?:mp3|ogg|wav))/i,
		`<audio class="post-audio" src="$1" controls>Your browser does not support the audio tag.</audio>`
	);

	const element = document.getElementById(nID) as HTMLDivElement;
	if (element) {
		element.addEventListener("click", (event: Event) => {});
	}

	return txt;
};

export default displayContent;
