import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import Rightbar from "../../components/rightbar/Rightbar";
import { axiosInstance } from "../../config";

export default function Profile() {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const [user, setUser] = useState({});
	const [width, setWidth] = useState();
	const { username } = useParams();
	const [file1, setFile1] = useState(null);

	const { user: currentUser, dispatch } = useContext(AuthContext);

	useEffect(() => {
		const fetchUser = async () => {
			const res = await axiosInstance.get("/user?username=" + username);
			setUser(res.data);
		};
		fetchUser();
	}, [username]);

	console.log();

	const handleClick1 = async (e) => {
		e.preventDefault();

		console.log(e.target.value);

		const uploadProfile = {
			userId: currentUser._id,
		};

		if (file1) {
			const data = new FormData();
			const fileName = Date.now() + file1.name;
			data.append("name", fileName);
			data.append("file", file1);
			e.target.value === "cover"
				? (uploadProfile.coverPicture = fileName)
				: (uploadProfile.profilePicture = fileName);

			const updateMessageProfile = {
				owner: currentUser._id,
				profilePicture: fileName,
			};

			try {
				await axiosInstance.post("/upload", data);
				e.target.value === "profile" &&
					dispatch({ type: "UPLOAD", payload: fileName });

				if (e.target.value === "profile") {
					await axiosInstance.put("/messages", updateMessageProfile);
				}
			} catch (err) {}
		}
		try {
			await axiosInstance.put("/user/" + currentUser._id, uploadProfile);
			window.location.reload();
		} catch (err) {}
	};

	setInterval(() => {
		if (window.innerWidth <= 430) {
			setWidth(true);
		} else {
			setWidth(false);
		}
	}, 1000);

	return (
		<>
			<Topbar />
			<div className="profile">
				<Sidebar />
				<div className="profileRight">
					<div className="profileRightTop">
						<div className="profileCover">
							<img
								className="profileCoverImg"
								src={
									user.coverPicture
										? PF + user.coverPicture
										: PF + "person/noCover.png"
								}
								alt=""
							/>
							<img
								className="profileUserImg"
								src={
									(user._id === currentUser._id &&
										PF + currentUser.profilePicture) ||
									user.profilePicture
										? PF + user.profilePicture
										: PF + "person/noAvatar.png"
								}
								alt=""
							/>
							{currentUser.username === user.username && (
								<form class="uploadForm">
									<label htmlFor="file">
										<input
											className="uploadProfile"
											onChange={(e) => setFile1(e.target.files[0])}
											type="file"
											id="file"
											style={{ display: "none" }}
										/>
										<span>Click here </span>
										<IconButton
											color="primary"
											aria-label="upload picture"
											component="span"
										>
											<PhotoCamera size="30px" />
										</IconButton>
									</label>
									<label htmlFor="submit" class="uploadButton">
										<input
											id="submit"
											style={{ display: "none" }}
											type="submit"
											onClick={handleClick1}
											value="profile"
										/>

										<Button
											variant="contained"
											color="primary"
											component="span"
											disabled={!file1}
										>
											Upload Profile Picture
										</Button>
									</label>

									<label htmlFor="submitCover" class="uploadButton">
										<input
											id="submitCover"
											style={{ display: "none" }}
											type="submit"
											onClick={handleClick1}
											style={{ display: "none" }}
											value="cover"
										/>

										<Button
											variant="contained"
											color="primary"
											component="span"
											disabled={!file1}
										>
											Upload Cover Picture
										</Button>
									</label>

									<br />
								</form>
							)}
						</div>
						<div className="profileInfo">
							<h4 className="profileInfoName">{user.username}</h4>
							<span className="profileInfoDesc">{user.desc}</span>
						</div>

						{/* <div className="lowPixelContainer">
							<span className="lowPixel">User Information</span>
						</div> */}
						<div className="lowPixelWidth">
							{width && <Rightbar user={user} />}
						</div>
					</div>
					<div className="profileRightBottom">
						<Feed username={username} />

						{width === false && user._id !== undefined ? (
							<Rightbar user={user} />
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}
