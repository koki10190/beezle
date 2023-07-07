import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./Welcome/Welcome";
import Home from "./Home/Home";
import HomeProfile from "./Home/HomeProfile";
import HomeEditProfile from "./Home/HomeEditProfile";
import Post from "./Components/MainPanel/Post";
import HomePost from "./Home/HomePost";
import socket from "./io/socket";
import Followers from "./Components/MainPanel/Followers";
import HomeFollowers from "./Home/HomeFollowers";
import HomeFollowing from "./Home/HomeFollowing";

function App() {
	socket.connect();

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
				<Route
					path="/followers/:handle"
					element={
						<HomeFollowers />
					}
				/>
				<Route
					path="/following/:handle"
					element={
						<HomeFollowing />
					}
				/>
				<Route
					path="/post"
					element={<HomePost />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
