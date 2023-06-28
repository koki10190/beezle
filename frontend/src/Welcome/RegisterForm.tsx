import axios from "axios";
import { FormEvent, useRef } from "react";
import RegisterTokenData from "../interfaces/RegisterTokenData";

interface RegisterFormInterface {
	state_change: (bool: boolean) => void;
}

function RegisterForm({ state_change }: RegisterFormInterface) {
	const register_form = useRef<HTMLFormElement>(null);
	const username = useRef<HTMLInputElement>(null);
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const confirm_password = useRef<HTMLInputElement>(null);
	const register_error = useRef<HTMLParagraphElement>(null);
	const btn = useRef<HTMLButtonElement>(null);

	const register = (event: FormEvent) => {
		event.preventDefault();
		btn.current!.disabled = true;
		register_error.current!.style.color = "white";
		register_error.current!.innerText = "Registering, please wait...";

		if (
			!email.current!.value.match(
				/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
			)
		) {
			register_error.current!.style.color = "red";
			register_error.current!.innerText =
				"Invalid email address!";
			btn.current!.disabled = false;
			return;
		}

		if (!username.current!.value.match(/^[a-z0-9\._-]+$/g)) {
			register_error.current!.style.color = "red";
			register_error.current!.innerText =
				"The username cannot have any special characters except of dots, dashes and underscores!";
			btn.current!.disabled = false;
			return;
		}
		if (password.current!.value != confirm_password.current!.value) {
			register_error.current!.style.color = "red";
			register_error.current!.innerText =
				"The passwords do not match!";
			btn.current!.disabled = false;
			return;
		}
		axios.post("http://localhost:3000/api/register-user", {
			name: username.current?.value,
			email: email.current?.value,
			password: password.current?.value,
		}).then(res => {
			const data = res.data as RegisterTokenData;
			if (data.was_error) {
				register_error.current!.innerText =
					data.error;

				register_error.current!.style.color =
					"red";
				btn.current!.disabled = false;
				return;
			}
			console.log(data);
			localStorage.setItem("auth_token", data.token);

			register_error.current!.innerText =
				"Thank you for registering! Redirecting...";
		});
	};

	const state_stuff = () => state_change(false);

	return (
		<form
			onSubmit={register}
			ref={register_form}
			className="welcome-form-registration form-group"
		>
			<input
				name="name"
				placeholder="Username"
				ref={username}
				required
				className="form-control"
			/>
			<p className="username-field-text">
				Only letters, numbers, dots, dashes, and
				underscores are allowed.
			</p>

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
			<input
				name="confirm_password"
				ref={confirm_password}
				placeholder="Confirm Password"
				required
				className="form-control"
				type="password"
			/>
			<button ref={btn} type="submit">
				Register
			</button>
			<p ref={register_error} className="register-error"></p>
			<a
				type="button"
				onClick={state_stuff}
				className="centered-text-form"
			>
				Login Instead
			</a>
		</form>
	);
}

export default RegisterForm;
