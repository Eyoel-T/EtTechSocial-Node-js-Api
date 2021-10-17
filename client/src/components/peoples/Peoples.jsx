import React, { useContext, useEffect, useState } from "react";
import Topbar from "../../components/topbar/Topbar.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Rightbar from "../../components/rightbar/Rightbar.jsx";
import "./peoples.css";
import { Link } from "react-router-dom";
import Card from "../../components/card/Card";
import { AuthContext } from "../../context/AuthContext.js";
import { axiosInstance } from "../../config.js";

function Peoples() {
	const [peoples, setPeoples] = useState([]);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		const fetchPeoples = async () => {
			try {
				const peoples = await axiosInstance.get(`/user/${user._id}/all`);
				setPeoples(peoples.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchPeoples();
	}, [user._id]);

	return (
		<>
			<Topbar />
			<div className="homeContainer">
				<Sidebar />

				<div className="peoples">
					<ul className="sidebarFriendList1">
						{peoples.map((p) => {
							return (
								<Link
									to={"profile/" + p.username}
									style={{ textDecoration: "none", color: "black" }}
								>
									<Card
										src={
											p.profilePicture
												? p.profilePicture
												: "person/noAvatar.png"
										}
										name={p.username}
										followers={p.followers}
										followings={p.followings}
									/>
								</Link>
							);
						})}
					</ul>
				</div>

				<Rightbar />
			</div>
		</>
	);
}

export default Peoples;
