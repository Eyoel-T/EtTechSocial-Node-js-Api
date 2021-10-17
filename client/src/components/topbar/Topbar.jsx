import React, { useContext, useRef } from "react";
import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import AccountMenu from "../avatar/AccountMenu.jsx";

import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
	const input = useRef();

	function handleSubmit(e) {
		e.preventDefault();
		console.log(input.current.value);
	}

	const { user } = useContext(AuthContext);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	return (
		<div className="topbarContainer">
			<div className="topbarLeft">
				<Link to="/" style={{ textDecoration: "none" }}>
					<span className="logo">EtTechSocial</span>
				</Link>
			</div>
			<div className="topbarCenter">
				<form className="searchbar" onSubmit={handleSubmit}>
					<Search className="searchIcon" />
					<input
						placeholder="Search for friend,post or video"
						className="searchInput"
						ref={input}
					/>
				</form>
			</div>

			<div className="topbarRight">
				<div className="topbarLinks">
					<Link to="/" style={{ textDecoration: "none", color: "white" }}>
						<span className="tobarLink">Timeline</span>
					</Link>
				</div>

				<div className="topbarIcons">
					<Link
						to="/peoples"
						style={{ textDecoration: "none", color: "white" }}
					>
						<div className="topbarIconItem">
							<Person />
							<span className="topbarIconBadge">1</span>
						</div>
					</Link>
					<Link
						to="/messenger"
						style={{ textDecoration: "none", color: "white" }}
					>
						<div className="topbarIconItem">
							<Chat />
							<span className="topbarIconBadge">2</span>
						</div>
					</Link>

					<div className="topbarIconItem">
						<Notifications />
						<span className="topbarIconBadge">1</span>
					</div>
				</div>

				<AccountMenu
					src={
						user.profilePicture
							? PF + user.profilePicture
							: PF + "person/noAvatar.png"
					}
					username={user.username}
				/>
			</div>
		</div>
	);
}
