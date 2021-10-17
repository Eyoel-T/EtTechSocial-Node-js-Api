import React, { useContext } from "react";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";

import Setting from "./components/setting/Setting";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Peoples from "./components/peoples/Peoples";
import Info from "./components/info/Info";
import Messenger from "./pages/messenger/Messenger";

function App() {
	const { user } = useContext(AuthContext);

	function Check() {
		if (user && user.isFirstTime) {
			return <Info />;
		} else if (user) {
			return <Home />;
		} else if (!user) {
			return <Login />;
		}
	}
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Check />
				</Route>
				<Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
				<Route path="/register">
					<Register />
				</Route>
				<Route exact path="/profile/:username">
					{user ? <Profile /> : <Redirect to="/" />}
				</Route>
				<Route exact path="/peoples">
					<Peoples />
				</Route>
				<Route path="/setting/:username">
					{user ? <Setting /> : <Redirect to="/" />}
				</Route>
				<Route path="/messenger">
					{user ? <Messenger /> : <Redirect to="/" />}
				</Route>
			</Switch>
		</Router>
	);
}
export default App;
