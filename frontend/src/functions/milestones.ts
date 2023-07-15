enum Milestones {
	FOLLOWERS_1K = 0,
	LIKES_1K = 1,
	REPOSTS_1K = 2,
	FOLLOWERS_100K = 3,
}

function milestones(stones: Milestones[]) {
	let milestones = "";

	stones.forEach(stone => {
		switch (stone) {
			case Milestones.FOLLOWERS_1K:
				milestones += `<i class="fa-duotone fa-users"></i>`;
				break;
			case Milestones.LIKES_1K:
				milestones += `<i class="fa-solid fa-circle-heart"></i>`;
				break;
			case Milestones.REPOSTS_1K:
				milestones += `<i class="fa-duotone fa-repeat"></i>`;
				break;
			case Milestones.FOLLOWERS_100K:
				milestones += `<i class="fa-solid fa-bee"></i>`;
				break;
		}
	});

	return milestones;
}

export { milestones, Milestones };
