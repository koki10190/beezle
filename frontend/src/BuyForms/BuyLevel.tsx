import { CardElement, AddressElement, useElements, useStripe } from "@stripe/react-stripe-js";
import "./BuyLevel.css";
import { FormEvent } from "react";
import { api_url } from "../constants/ApiURL";

function BuyLevel() {
	const elements = useElements();
	const stripe = useStripe();

	const handlePayment = async (e: FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements) return;

		const { clientSecret } = await fetch(`${api_url}/create-payment-intent`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				paymentMethodType: "card",
				currency: "eur",
			}),
		}).then(r => r.json());
		console.log("Payment intent created: " + clientSecret);

		const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
			payment_method: { card: elements.getElement(CardElement)! },
		});
		console.log(paymentIntent);
	};

	return (
		<>
			<div className="payment-box">
				<h1>Buy 5 Levels</h1>
				<form
					id="payment-form"
					onSubmit={handlePayment}
				>
					<div className="payment">
						<label
							style={{ fontSize: "25px" }}
							htmlFor="card-element"
						>
							Credit or Debit Card Number
						</label>
						<CardElement />
						{/* <br></br>
						<label
							style={{ fontSize: "25px" }}
							htmlFor="address-element"
						>
							Billing Address
						</label>
						<AddressElement
							options={{
								mode: "billing",
								autocomplete: { mode: "automatic" },
							}}
						/> */}
						<br></br>
						<button>Pay</button>
					</div>
				</form>
			</div>
		</>
	);
}

export default BuyLevel;
