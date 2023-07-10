import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import socket from "./io/socket.ts";

if (!socket.connected) socket.connect();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	//<React.StrictMode>
	<App />
	//</React.StrictMode>
);
