function StatusCheck(status: "online" | "idle" | "offline" | "dnd") {
	switch (status) {
		case "online":
			return "lime";
		case "offline":
			return "gray";
		case "dnd":
			return "#ff2424";
		case "idle":
			return "#ffc524";
	}
}
