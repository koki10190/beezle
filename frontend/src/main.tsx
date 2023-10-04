import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import socket from "./io/socket.ts";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

if (!socket.connected) socket.connect();
(async () => {
	const stripePromise = loadStripe("pk_test_51NxVJeDGCgSGzojFgoLBZNk9NlXfawsvfXsMf0Jdj4CpFqlrqt2TBi3VYGdGK1LRE3NdxVNL98CkUVz2oJORnYHE00cuGryi0F");
	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
		//<React.StrictMode>
		<Elements stripe={stripePromise}>
			<App />
		</Elements>
		//</React.StrictMode>
	);
})();
