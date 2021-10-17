import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import { axiosInstance } from "../../config";

export default function Rightbar({ user, lowPixel }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const [friends, setFriends] = useState([]);
	const [followers, setFollowers] = useState([]);
	const { user: currentUser, dispatch } = useContext(AuthContext);
	const [followed, setFollowed] = useState(
		currentUser.followings.includes(user?._id)
	);
	const [isConversation, setIsConversation] = useState(false);

	console.log(followed);
	useEffect(() => {
		const getFriends = async () => {
			try {
				const friendList = await axiosInstance.get("/user/friends/" + user._id);
				const followersList = await axiosInstance.get(
					"/user/followers/" + user._id
				);
				setFriends(friendList.data);
				setFollowers(followersList.data);
			} catch (err) {
				console.log(err);
			}
		};

		getFriends();
	}, [user, followed]);

	useEffect(() => {
		const fetchConversation = async () => {
			const conversation = await axiosInstance.get(
				"/conversations/" + user?._id
			);

			if (conversation.data[0]?.members.includes(currentUser._id)) {
				setIsConversation(true);
			}
		};

		fetchConversation();
	}, [user, currentUser]);

	const handleClick = async () => {
		console.log("i got clicked");
		const newConv = {
			senderId: user._id,
			receiverId: currentUser._id,
		};
		try {
			if (followed) {
				await axiosInstance.put(`/user/${user._id}/unfollow`, {
					userId: currentUser._id,
				});
				dispatch({ type: "UNFOLLOW", payload: user._id });
			} else {
				await axiosInstance.put(`/user/${user._id}/follow`, {
					userId: currentUser._id,
				});

				if (!isConversation) {
					console.log(isConversation + "new conversation");
					await axiosInstance.post("/conversations", newConv);
				}

				dispatch({ type: "FOLLOW", payload: user._id });
			}
			setFollowed(!followed);
		} catch (err) {}
	};

	const HomeRightbar = () => {
		return (
			<div className="homeRightBar">
				<div className="birthdayContainer">
					<img className="birthdayImg" src={PF + "gift.png"} alt="" />
					<span className="birthdayText">
						<b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
					</span>
				</div>
				<img className="rightbarAd" src={PF + "ad.png"} alt="" />
				<h4 className="rightbarTitle">Online Friends</h4>
				<ul className="rightbarFriendList">
					{Users.map((u) => (
						<Online key={u.id} user={u} />
					))}
				</ul>
			</div>
		);
	};

	const ProfileRightbar = () => {
		return (
			<div className="ProfileRightbar">
				{user.username !== currentUser.username && (
					<button className="rightbarFollowButton" onClick={handleClick}>
						{followed ? "Unfollow" : "Follow"}
						{followed ? <Remove /> : <Add />}
					</button>
				)}
				<h4 className="rightbarTitle">User information</h4>
				<div className="rightbarInfo">
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">City:</span>
						<span className="rightbarInfoValue">{user.city}</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">From:</span>
						<span className="rightbarInfoValue">{user.from}</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">Relationship:</span>
						<span className="rightbarInfoValue">
							{user.relationship === 1
								? "Single"
								: user.relationship === 2
								? "Married"
								: "-"}
						</span>
					</div>
				</div>
				<h4 className="rightbarTitle">User followings</h4>
				<div className="rightbarFollowings">
					{friends.map((friend) => (
						<Link
							to={"/profile/" + friend.username}
							style={{ textDecoration: "none" }}
						>
							<div className="rightbarFollowing">
								<img
									src={
										friend.profilePicture
											? PF + friend.profilePicture
											: PF + "person/noAvatar.png"
									}
									alt=""
									className="rightbarFollowingImg"
								/>
								<span className="rightbarFollowingName">{friend.username}</span>
							</div>
						</Link>
					))}
				</div>
				<h4 className="rightbarTitle">User followers</h4>
				<div className="rightbarFollowings">
					{followers.map((follower) => (
						<Link
							to={"/profile/" + follower.username}
							style={{ textDecoration: "none" }}
						>
							<div className="rightbarFollowing">
								<img
									src={
										follower.profilePicture
											? PF + follower.profilePicture
											: PF + "person/noAvatar.png"
									}
									alt=""
									className="rightbarFollowingImg"
								/>
								<span className="rightbarFollowingName">
									{follower.username}
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		);
	};
	return (
		<div className="rightbar">
			<div className="rightbarWrapper">
				{user ? <ProfileRightbar /> : <HomeRightbar />}
			</div>
		</div>
	);
}
