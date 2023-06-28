import axios from "axios";
import { FormEvent, useRef } from "react";
// import LoginTokenData from "../interfaces/LoginTokenData";

interface LoginFormInterface {
	state_change: (bool: boolean) => void;
}

function LoginForm({ state_change }: LoginFormInterface) {
	const login_form = useRef<HTMLFormElement>(null);
	const username = useRef<HTMLInputElement>(null);
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const confirm_password = useRef<HTMLInputElement>(null);
	const login_error = useRef<HTMLParagraphElement>(null);
	const btn = useRef<HTMLButtonElement>(null);

	const Login = (event: FormEvent) => {
		event.preventDefault();
		btn.current!.disabled = true;
		login_error.current!.style.color = "white";
		login_error.current!.innerText = "Logging in, please wait...";
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
				placeholder="Password"
				required
				className="form-control"
				type="password"
			/>
			<button ref={btn} type="submit">
				Login
			</button>
			<p ref={login_error} className="register-error"></p>
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
