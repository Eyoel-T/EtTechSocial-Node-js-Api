import React from "react";
import "./message.css";
import { format } from "timeago.js";

export default function Message({ message, own }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	console.log(message);
	return (
		<div className={own ? "message own" : "message"}>
			<div className="messageTop">
				<img
					className="messageImg"
					src={message && PF + message.profilePicture}
					alt=""
				/>
				<p className="messageText">{message.text}</p>
			</div>
			<div className="messageBottom">{format(message.createdAt)}</div>
		</div>
	);
}
