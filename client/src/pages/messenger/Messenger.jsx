import React, { useRef, useContext, useEffect, useState } from "react";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import Onlinefriends from "../../components/onlinefriends/Onlinefriends";
import Topbar from "../../components/topbar/Topbar";
import { AuthContext } from "../../context/AuthContext";
import "./messenger.css";
import { io } from "socket.io-client";
import { axiosInstance } from "../../config";

export default function Messenger() {
	const { user } = useContext(AuthContext);
	const [currentChat, setCurrentChat] = useState(null);
	const [newMessage, setNewMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [conversations, setConversations] = useState([]);
	const [onlineUsers, setOnlineUsers] = useState([]);

	const socket = useRef();
	const scrollRef = useRef();

	const handleClick = (e, c) => {
		setCurrentChat(c);
		console.log(e.target.innerText);
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
	};

	// console.log(socket);

	useEffect(() => {
		socket.current = io("ws://localhost:8900");
		socket.current.on("getMessage", (data) => {
			setArrivalMessage({
				sender: data.senderId,
				text: data.text,
				profilePicture: data.profilePicture,
				createdAt: Date.now(),
			});
		});
		console.log("am firing socket");
	}, []);

	useEffect(() => {
		arrivalMessage &&
			currentChat?.members.includes(arrivalMessage.sender) &&
			setMessages((prev) => [...prev, arrivalMessage]);
	}, [arrivalMessage, currentChat]);

	useEffect(() => {
		socket.current.emit("addUser", user._id);
		socket.current.on("getUsers", (users) => {
			console.log(users);
			setOnlineUsers(users);
		});
	}, [user]);

	useEffect(() => {
		const getMessages = async () => {
			try {
				const res = await axiosInstance.get("/messages/" + currentChat?._id);
				setMessages(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getMessages();
	}, [currentChat]);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await axiosInstance.get("/conversations/" + user._id);
				console.log(res.data);
				setConversations(res.data);
			} catch (err) {
				console.log(err);
			}
		};
		getConversations();
	}, [user._id]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const message = {
			sender: user._id,
			text: newMessage,
			conversationId: currentChat._id,
			profilePicture: user.profilePicture,
		};

		const receiverId = currentChat.members.find(
			(member) => member !== user._id
		);

		socket.current.emit("sendMessage", {
			senderId: user._id,
			receiverId,
			text: newMessage,
			profilePicture: user.profilePicture,
		});

		try {
			const res = await axiosInstance.post("/messages", message);
			setMessages([...messages, res.data]);
			setNewMessage("");
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<>
			<Topbar />
			<div className="messenger">
				<div className="chatMenu">
					<div className="chatMenuWrapper">
						<input
							className="chatMenuInput"
							placeholder="Search for Friends"
							type="text"
						/>

						{conversations.map((c) => (
							<div onClick={(e) => handleClick(e, c)}>
								<Conversation conversation={c} currentUser={user} />
							</div>
						))}
					</div>
				</div>
				<div className="chatBox hidden">
					<div className="chatBoxWrapper">
						{currentChat ? (
							<>
								<div className="chatBoxTop">
									{messages.map((m) => (
										<div ref={scrollRef}>
											<Message
												message={m}
												own={m.sender === user._id ? true : false}
											/>
										</div>
									))}
								</div>
								<div className="chatBoxBottom">
									<textarea
										name=""
										placeholder="write Somthing"
										className="chatMessageInput"
										onChange={(e) => setNewMessage(e.target.value)}
										value={newMessage}
									></textarea>
									<button className="chatSubmitButton" onClick={handleSubmit}>
										send
									</button>
								</div>
							</>
						) : (
							<span className="noConversation">
								open conversation to start a Chat
							</span>
						)}
					</div>
				</div>
				<div className="chatOnline">
					<div className="chatOnlineWrapper">
						online friends
						<Onlinefriends
							onlineUsers={onlineUsers}
							currentUser={user._id}
							setCurrentChat={setCurrentChat}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
