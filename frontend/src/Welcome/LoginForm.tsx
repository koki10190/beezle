import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import RegisterTokenData from "../interfaces/RegisterTokenData";
import { api_url } from "../constants/ApiURL";
import { useNavigate } from "react-router-dom";
// import LoginTokenData from "../interfaces/LoginTokenData";

interface LoginFormInterface {
	state_change: (bool: boolean) => void;
}

function LoginForm({ state_change }: LoginFormInterface) {
	const navigate = useNavigate();
	const login_form = useRef<HTMLFormElement>(null);
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const login_error = useRef<HTMLParagraphElement>(null);
	const btn = useRef<HTMLButtonElement>(null);
	const [text, setText] = useState("Forgot Password");

	const forgot_pass = async () => {
		axios.post(`${api_url}/settings/forgot-pass`, {
			email: email.current!.value,
			password: password.current?.value,
		}).then(res => {
			setText("Check your E-Mail Address to confirm changes.");
		});
	};

	const Login = (event: FormEvent) => {
		event.preventDefault();
		btn.current!.disabled = true;
		login_error.current!.style.color = "white";
		login_error.current!.innerText = "Logging in, please wait...";

		axios.post(`${api_url}/api/login`, {
			email: email.current!.value,
			password: password.current!.value,
		}).then(res => {
			const data = res.data as RegisterTokenData;

			if (data.was_error) {
				login_error.current!.style.color =
					data.error === "An email has been sent, please verify your account" ? "lime" : "red";
				login_error.current!.innerText = data.error;

				btn.current!.disabled = false;
				return;
			}

			localStorage.setItem("auth_token", data.token);
			navigate("/home");
		});
	};

	const state_stuff = () => state_change(true);

	return (
		<form
			onSubmit={Login}
			ref={login_form}
			className="welcome-form-registration form-group"
		>
			<input
				name="email"
				ref={email}
				placeholder="E-Mail Address"
				required
				className="form-control"
			/>
			<input
				name="password"
				ref={password}
				placeholder="Password (If you forgot password, type new one here)"
				required
				className="form-control"
				type="password"
			/>
			<button
				ref={btn}
				type="submit"
			>
				Login
			</button>
			<p
				ref={login_error}
				className="register-error"
			></p>
			<a
				onClick={forgot_pass}
				className="centered-text-form"
			>
				{text}
			</a>
			<br></br>
			<br></br>
			<a
				onClick={state_stuff}
				className="centered-text-form"
			>
				Register Instead
			</a>
		</form>
	);
}

export default LoginForm;
