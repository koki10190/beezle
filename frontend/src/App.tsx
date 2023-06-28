import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./Welcome/Welcome";
import Home from "./Home/Home";
import HomeProfile from "./Home/HomeProfile";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Welcome />} />
				<Route
					path="/home"
					element={<Home />}
				/>
				<Route
					path="/:handle"
					element={<HomeProfile />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
