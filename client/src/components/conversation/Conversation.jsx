import { axiosInstance } from "../../config";
import React, { useEffect, useState } from "react";
import "./conversation.css";
export default function Conversation({ conversation, currentUser }) {
	const [user, setUser] = useState(null);
	const friendId = conversation.members.find((m) => m !== currentUser._id);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	useEffect(() => {
		const getFriend = async (req, res) => {
			try {
				const res = await axiosInstance.get("/user?userId=" + friendId);
				setUser(res.data);
			} catch (err) {
				console.log(err);
			}
		};

		getFriend();
	}, [conversation, friendId]);
	return (
		<>
			{user && (
				<div className="conversation">
					<img
						className="conversationImg"
						src={user && PF + user.profilePicture}
						alt=""
					/>
					<span className="conversationName">{user && user.username}</span>
				</div>
			)}
		</>
	);
}
