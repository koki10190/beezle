document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	window.open = cordova.InAppBrowser.open;
	var ref = cordova.InAppBrowser.open("https://beezle.netlify.app", "_blank", "location=no,fullscreen=yes,hide=yes");

	const div = document.getElementsByTagName("div")[0];
	div.style.borderWidth = "2px";
	div.style.border = "solid 2px black";
}
