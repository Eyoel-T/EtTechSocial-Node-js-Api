import React, { useContext, useEffect, useState } from "react";
import "./post.css";
import { ThumbDown, ThumbUp } from "@material-ui/icons";

import { format } from "timeago.js";

import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";

export default function Post({ post }) {
	const [like, setLike] = useState(post.likes.length);
	const [isLiked, setIsLiked] = useState(false);
	const [user, setUser] = useState({});
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const { user: currentUser } = useContext(AuthContext);

	useEffect(() => {
		setIsLiked(post.likes.includes(currentUser._id));
	}, [post.likes, currentUser._id]);

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await axiosInstance.get(`/user?userId=${post.userId}`);
			setUser(res.data);
		};
		fetchUsers();
	}, [post.userId]);

	function likeHandler() {
		if (isLiked === false) {
			setLike(like + 1);
			axiosInstance.put("/posts/" + post._id + "/like", {
				userId: currentUser._id,
			});
			setIsLiked(true);
		}
	}

	function dislikeHandler() {
		if (isLiked === true) {
			setLike(like - 1);
			axiosInstance.put("/posts/" + post._id + "/like", {
				userId: currentUser._id,
			});
			setIsLiked(false);
		}
	}

	return (
		<div className="post">
			<div className="postWrapper">
				<div className="postTop">
					<div className="postTopLeft">
						<Link to={`/profile/${user.username}`}>
							<img
								src={
									user.profilePicture
										? PF + user.profilePicture
										: PF + "person/noAvatar.png"
								}
								alt=""
								className="postProfileImg"
							/>
						</Link>
						<span className="postUsername">{user.username}</span>
						<span className="postDate">{format(post.createdAt)}</span>
					</div>

					{/* <div className="postTopRight">
						<MoreVert />
					</div> */}
				</div>
				<div className="postCenter">
					<span className="postText">{post?.desc}</span>
					<img className="postImg" src={PF + post.img} alt="" />
				</div>
				<div className="postBottom">
					<div className="postBottomLeft">
						<ThumbUp className="likeIcon" onClick={likeHandler} />
						<ThumbDown className="dislikeIcon" onClick={dislikeHandler} />

						<span className="postLikeCounter">{like} people like it</span>
					</div>
				</div>
			</div>
		</div>
	);
}
