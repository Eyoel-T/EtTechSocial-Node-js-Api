import React, { useContext, useRef } from "react";
import "./login.css";

import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
export default function Login() {
	const email = useRef();
	const password = useRef();

	const { user, isFetching, dispatch } = useContext(AuthContext);
	const handleClick = (e) => {
		e.preventDefault();
		loginCall(
			{ email: email.current.value, password: password.current.value },
			dispatch
		);
	};
	console.log(user);
	return (
		<div className="login">
			<div className="loginWrapper">
				<div className="loginLeft">
					<h3 className="loginLogo">EtTechSocial</h3>
					<span className="loginDesc">
						Connect with friends and the world around you on EtTechSocial.
					</span>
				</div>
				<div className="loginRight">
					<form className="loginBox" onSubmit={handleClick}>
						<input
							placeholder="Email"
							type="Email"
							className="loginInput"
							required
							ref={email}
						/>
						<input
							placeholder="Password"
							type="password"
							className="loginInput"
							required
							minLength="6"
							ref={password}
						/>
						<button type="submit" className="loginButton" disabled={isFetching}>
							{isFetching ? (
								<CircularProgress color="white" size="25px" />
							) : (
								"Log in"
							)}
						</button>
						<span className="loginForgot">Forgot Password?</span>
						<Link to="/register">
							<button className="loginRegisterButton">
								Create a New Account
							</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
