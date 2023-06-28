import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./Welcome/Welcome";
import Home from "./Home/Home";
import HomeProfile from "./Home/HomeProfile";
import HomeEditProfile from "./Home/HomeEditProfile";

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
					path="/profile/:handle"
					element={<HomeProfile />}
				/>
				<Route
					path="/user/edit-profile"
					element={
						<HomeEditProfile />
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
