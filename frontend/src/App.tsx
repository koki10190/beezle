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
import HomeBookmarks from "./Home/HomeBookmarks";
import HomePostPage from "./Home/HomePostPage";
import HomeSearch from "./Home/HomeSearch";
import { ToastContainer } from "react-toastify";
import GetUserData from "./api/GetUserData";
import { useEffect, useState } from "react";
import HomeNotification from "./Home/HomeNotification";

function App() {
	socket.connect();
	const [gotHandle, setGot] = useState(false);

	useEffect(() => {
		(async () => {
			const data = await GetUserData();
			if (!data.error) socket.emit("get-handle", data.user.handle);
		})();
	}, [gotHandle]);

	return (
		<>
			<ToastContainer />

			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<Welcome />}
					/>
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
						element={<HomeEditProfile />}
					/>
					<Route
						path="/followers/:handle"
						element={<HomeFollowers />}
					/>
					<Route
						path="/following/:handle"
						element={<HomeFollowing />}
					/>
					<Route
						path="/post"
						element={<HomePost />}
					/>
					<Route
						path="/bookmarks"
						element={<HomeBookmarks />}
					/>
					<Route
						path="/post/:postID"
						element={<HomePostPage />}
					/>
					<Route
						path="/search"
						element={<HomeSearch />}
					/>
					<Route
						path="/notifications"
						element={<HomeNotification />}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
