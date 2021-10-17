import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router";
import "./register.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { axiosInstance } from "../../config";

export default function Login() {
	const username = useRef();
	const email = useRef();
	const password = useRef();
	const passwordAgain = useRef();
	const histor = useHistory();
	const { user } = useContext(AuthContext);

	const [load, setLoad] = useState(false);

	localStorage.clear();
	user && window.location.reload(true);

	const handleLoad = () => {
		setLoad(true);
	};

	const handleClick = (e) => {
		e.preventDefault();
		handleLoad();
		if (passwordAgain.current.value !== password.current.value) {
			console.log("not match");
			password.current.setCustomValidity("Password don't match!");
			setTimeout(() => {
				password.current.setCustomValidity("");
			}, 5000);
		} else {
			console.log("match");
			const user = {
				username: username.current.value,
				email: email.current.value,
				password: password.current.value,
			};
			try {
				axiosInstance.post("auth/register", user);

				setTimeout(function () {
					histor.push("/login");
				}, 2000);
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<div className="login1">
			<div className="loginWrapper1">
				<div className="loginLeft1">
					<h3 className="loginLogo1">EtTechSocial</h3>
					<span className="loginDesc1">
						Connect with friends and the world around you on EtTechSocial.
					</span>
				</div>
				<div className="loginRight1">
					<form className="loginBox1" onSubmit={handleClick}>
						<input
							placeholder="Username"
							ref={username}
							required
							type="text"
							className="loginInput1"
						/>
						<input
							placeholder="Email"
							ref={email}
							required
							type="Email"
							className="loginInput1"
						/>
						<input
							placeholder="Password"
							ref={password}
							required
							type="password"
							className="loginInput1"
							minLength="6"
						/>
						<input
							placeholder="Password Again"
							ref={passwordAgain}
							required
							type="password"
							className="loginInput1"
							minLength="6"
						/>

						<button className="loginButton1">
							{load ? (
								<CircularProgress color="white" size="25px" />
							) : (
								"Sign Up"
							)}
						</button>
						<Link to="/login">
							<button className="loginRegisterButton1">
								Log In to Account
							</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
