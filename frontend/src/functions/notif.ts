function notifToast(text: string, options: NotificationOptions) {
	options.icon = "icon.png";
	console.log("huh");
	return new Notification(text, options);
}

export default notifToast;
