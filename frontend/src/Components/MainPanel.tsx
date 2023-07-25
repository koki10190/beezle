import Post from "./MainPanel/Post";
import "./navigation.css";

function MainPanel() {
	return <Post fetch_method="follow-posts" />;
}

export default MainPanel;
