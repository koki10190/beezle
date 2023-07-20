import { useEffect, useState } from "react";
import "./Shop.css";
import UserType from "../interfaces/UserType";
import GetUserData from "../api/GetUserData";
import ItemType from "../interfaces/ItemType";
import axios from "axios";
import { api_url } from "../constants/ApiURL";
import { Icons, toast } from "react-toastify";

function Shop() {
	const [user, setUser] = useState<UserType | null>(null);

	const [items, setItems] = useState<ItemType[]>([]);

	useEffect(() => {
		(async () => {
			const data = (await GetUserData()).user;
			setUser(data);

			const items = await axios.get(`${api_url}/activity-items`);
			setItems(items.data as ItemType[]);
		})();
	}, []);

	return (
		<>
			<div className="navigation-panel main-panel activity-shop">
				<h1>
					<i className="fa-solid fa-cart-shopping-fast"></i> Activity Shop
				</h1>
				<hr
					className="small-bar"
					style={{ marginBottom: "20px" }}
				></hr>
				<a className="coins">
					<i className="fa-solid fa-coins"></i>{" "}
					{user ? user.coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0} Activity Coins
				</a>
				<br></br>

				{items.map(item => (
					<div className="shop-item-shape">
						<h1>{item.name}</h1>
						<h2 style={{ marginTop: "-10px", color: "rgb(255, 187, 0)" }}>
							<i className="fa-solid fa-coins"></i>{" "}
							{item.price
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						</h2>
						<div
							className="preview-shape"
							style={{
								backgroundImage: "url(" + user?.avatar + ")",
								clipPath: item.style,
							}}
						></div>
						<button
							onClick={() => {
								const tst = toast("Buying item", {
									icon: Icons.spinner,
									progressStyle: {
										backgroundColor: "yellow",
									},
									theme: "dark",
									hideProgressBar: true,
								});

								axios.post(`${api_url}/buy-avatar-frame`, {
									token: localStorage.getItem(
										"auth_token"
									),
									name: item.name,
								}).then(async res => {
									const data = (
										await GetUserData()
									).user;
									setUser(data);
									toast.dismiss(tst);
									if (res.data.error)
										return alert(
											"There was an error when buying the item!"
										);
									toast(res.data.msg, {
										icon: Icons.info,
										progressStyle: {
											backgroundColor: "yellow",
										},
										theme: "dark",
									});
								});
							}}
							className="followbox buy-item"
						>
							BUY
						</button>
					</div>
				))}
			</div>
		</>
	);
}

export default Shop;
