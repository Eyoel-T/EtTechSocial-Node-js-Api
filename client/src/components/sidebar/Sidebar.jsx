import React, { useContext, useEffect, useState } from "react";
import "./sidebar.css";
import {
	Chat,
	PlayCircleFilledOutlined,
	Group,
	Bookmark,
	HelpOutline,
	WorkOutline,
	Event,
	School,
	Person,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import Closefriends from "../closefriend/Closefriend";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";

export default function Sidebar() {
	const { user } = useContext(AuthContext);
	const [friends, setFriends] = useState([]);

	useEffect(() => {
		const getFriends = async () => {
			const res = await axiosInstance.get("/user/friends/" + user._id);
			setFriends(res.data);
		};

		getFriends();
	}, [user]);
	return (
		<div className="sidebar">
			<div className="sidebarWrapper">
				<ul className="sidebarList">
					<Link
						to="/peoples"
						style={{ textDecoration: "none", color: "black" }}
					>
						<li className="sidebarListItem">
							<Person className="sidebarIcon" />
							<span className="sidebarListItemText">Peoples</span>
						</li>
					</Link>

					<Link
						to="/messenger"
						style={{ textDecoration: "none", color: "black" }}
					>
						<li className="sidebarListItem">
							<Chat className="sidebarIcon" />
							<span className="sidebarListItemText">Chats</span>
						</li>
					</Link>

					<li className="sidebarListItem">
						<PlayCircleFilledOutlined className="sidebarIcon" />
						<span className="sidebarListItemText">Videos</span>
					</li>

					<li className="sidebarListItem">
						<Group className="sidebarIcon" />
						<span className="sidebarListItemText">Groups</span>
					</li>
					<li className="sidebarListItem">
						<Bookmark className="sidebarIcon" />
						<span className="sidebarListItemText">Bookmarks</span>
					</li>
					<li className="sidebarListItem">
						<HelpOutline className="sidebarIcon" />
						<span className="sidebarListItemText">Questions</span>
					</li>
					<li className="sidebarListItem">
						<WorkOutline className="sidebarIcon" />
						<span className="sidebarListItemText">Jobs</span>
					</li>
					<li className="sidebarListItem">
						<Event className="sidebarIcon" />
						<span className="sidebarListItemText">Events</span>
					</li>
					<li className="sidebarListItem">
						<School className="sidebarIcon" />
						<span className="sidebarListItemText">Courses</span>
					</li>
				</ul>
				<button className="sidebarButton">Show more</button>
				<hr className="sidebarHr" />
				<ul className="sidebarFriendList">
					{friends.map((f) => (
						<Closefriends user={f} />
					))}
				</ul>
			</div>
		</div>
	);
}
