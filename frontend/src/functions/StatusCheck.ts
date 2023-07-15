function StatusCheck(status: string) {
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

export default StatusCheck;
