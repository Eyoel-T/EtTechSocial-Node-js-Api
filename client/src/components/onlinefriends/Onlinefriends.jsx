import React, { useEffect, useState } from "react";
import "./onlinefriends.css";
import { axiosInstance } from "../../config";

export default function Onlinefriends({
	onlineUsers,
	currentUser,
	setCurrentChat,
}) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const [friends, setFriends] = useState([]);
	const [onlineFriends, setOnlineFriends] = useState([]);
	const [onlinePeoples, setOnlinePeoples] = useState([]);

	useEffect(() => {
		const getFriends = async (req, res) => {
			try {
				const res = await axiosInstance.get("/user/friends/" + currentUser);
				setFriends(res.data);
			} catch (err) {}
		};

		getFriends();
	}, [currentUser]);

	useEffect(() => {
		var online = [];
		onlineUsers.forEach(function (o) {
			online.push(o.userId);
		});
		console.log("onlineUsers firing");
		setOnlinePeoples(online);
	}, [onlineUsers]);

	useEffect(() => {
		var friendsOnline = [];
		friends.forEach(function (friend) {
			if (onlinePeoples.includes(friend._id)) {
				friendsOnline.push(friend);
			}
		});
		// console.log("friendsOnline");
		console.log("Friends online Firing");
		setOnlineFriends(friendsOnline);
	}, [onlinePeoples, friends]);
	console.log("finaly onine");
	console.log(onlineFriends);

	const handleClick = async (e, info) => {
		document.querySelector(".chatBox").classList.toggle("hidden");

		for (
			var i = 0;
			i < document.querySelectorAll(".conversation").length;
			i++
		) {
			if (
				document.querySelectorAll(".conversation")[i].innerText !==
				e.target.innerText
			) {
				document
					.querySelectorAll(".conversation")
					[i].classList.toggle("displayHidden");
			}
		}
		try {
			const conversation = await axiosInstance.get(
				`/conversations/find/${currentUser}/${info._id}`
			);
			setCurrentChat(conversation.data);
		} catch (err) {}
	};

	function OnlinePeoples({ info }) {
		return (
			<>
				<div className="onlinefriends " onClick={(e) => handleClick(e, info)}>
					<div className="onlineImgContainer">
						<img
							src={info ? PF + info.profilePicture : PF + "person/noAvatar.png"}
							alt=""
							className="onlinefriendsImg"
						/>
						<div className="onlineImgBadge"></div>
					</div>

					<span className="onlinefriendsName">
						{info ? info.username : "no name"}
					</span>
				</div>
			</>
		);
	}
	return (
		<>
			{onlineFriends.map((o) => (
				<OnlinePeoples info={o} />
			))}
		</>
	);
}
