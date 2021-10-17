import React, { useContext, useRef, useState } from "react";
import "./info.css";
import { Button } from "@material-ui/core";

import { PhotoCamera, Cancel } from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";

export default function Info({ display }) {
	const [profile, setProfile] = useState(null);
	const [cover, setCover] = useState(null);
	const { user, dispatch } = useContext(AuthContext);
	const bio = useRef();
	const city = useRef();
	const country = useRef();
	const [relation, setRelation] = useState(0);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	const handleClick = async (e) => {
		e.preventDefault();

		const NewInfo = {
			desc: bio.current.value,
			city: city.current.value,
			from: country.current.value,
			relationship: relation,
			userId: user._id,
			isFirstTime: false,
		};

		if (profile != null) {
			const profileImg = new FormData();
			const profileName = Date.now() + profile.name;
			profileImg.append("name", profileName);
			profileImg.append("file", profile);
			NewInfo.profilePicture = profileName;

			try {
				await axiosInstance.post("/upload", profileImg);
			} catch (err) {}
		}
		if (cover != null) {
			const coverImg = new FormData();
			const coverName = Date.now() + cover.name;
			coverImg.append("name", coverName);
			coverImg.append("file", cover);
			NewInfo.coverPicture = coverName;

			try {
				await axiosInstance.post("/upload", coverImg);
			} catch (err) {}
		}

		try {
			const updateUser = await axiosInstance.put("/user/" + user._id, NewInfo);
			setProfile(null);
			setCover(null);
			dispatch({ type: "UPDATE", payload: updateUser.data });
		} catch (err) {}

		console.log(NewInfo);
	};

	return (
		<>
			<div className={display ? "info display" : "info"}>
				<form className="infoWrapper" onSubmit={handleClick}>
					<div className="formLeft">
						<span className="leftLable">UserInfo </span>
						<div className="leftFormItem">
							<input
								placeholder={display ? "bio=> " + user.desc : "bio"}
								ref={bio}
								type="text"
								className="inputField"
							/>

							<input
								placeholder={display ? "city=> " + user.city : "city"}
								ref={city}
								type="text"
								className="inputField"
								required
							/>
							<input
								placeholder={display ? "country=> " + user.from : "country"}
								ref={country}
								type="text"
								className="inputField"
								required
							/>
						</div>

						<div className="leftFormItem">
							<label className="relationName">relationship status</label>
							<div
								className="relaitonOption"
								onChange={(e) => setRelation(e.target.value)}
							>
								{display && user.relationship === "1" ? (
									<label className="relationButton">
										<input type="radio" value="1" checked name="relationship" />
										single
									</label>
								) : (
									<label className="relationButton">
										<input type="radio" value="1" name="relationship" />
										single
									</label>
								)}
								{display && user.relationship === "2" ? (
									<label className="relationButton">
										<input type="radio" value="2" checked name="relationship" />
										married
									</label>
								) : (
									<label className="relationButton">
										<input type="radio" value="2" name="relationship" />
										married
									</label>
								)}
								{display && user.relationship === "0" ? (
									<label className="relationButton">
										<input type="radio" value="0" checked name="relationship" />
										none
									</label>
								) : (
									<label className="relationButton">
										<input type="radio" value="0" name="relationship" />
										none
									</label>
								)}
							</div>
						</div>
					</div>
					<div className="formRight">
						<span className="rightLable">
							User Profile
							<PhotoCamera size="30px" color="primary" />
						</span>

						<div className="uploadButton">
							<label htmlFor="profile">
								<input
									id="profile"
									type="file"
									style={{ display: "none" }}
									onChange={(e) => setProfile(e.target.files[0])}
								/>
								<Button
									variant="contained"
									color="primary"
									disabled={profile}
									component="span"
								>
									<PhotoCamera size="30px" color="white" />
									Profile Picture
								</Button>
							</label>
						</div>

						<div className="uploadButton">
							<label htmlFor="cover">
								<input
									id="cover"
									type="file"
									style={{ display: "none" }}
									onChange={(e) => setCover(e.target.files[0])}
								/>
								<Button
									variant="contained"
									disabled={cover}
									color="primary"
									component="span"
								>
									<PhotoCamera color="white" />
									Cover Picture..
								</Button>
							</label>
						</div>
						{cover && (
							<div className="shareImgContainer2">
								<img
									className="shareImg2"
									src={URL.createObjectURL(cover)}
									alt=""
								/>
								<Cancel
									className="shareCancelImg2"
									onClick={() => setCover(null)}
								/>
							</div>
						)}
						{profile && (
							<div className="shareImgContainer1">
								<img
									className="shareImg1"
									src={URL.createObjectURL(profile)}
									alt=""
									style={{ zIndex: "999" }}
								/>
								<Cancel
									className="shareCancelImg1"
									onClick={() => setProfile(null)}
								/>
							</div>
						)}

						{display && (
							<div className="shareImgContainer3">
								<img
									className="shareImg1"
									src={PF + user.profilePicture}
									alt=""
								/>
							</div>
						)}

						{display && (
							<div className="shareImgContainer4">
								<img
									className="shareImg2"
									src={PF + user.coverPicture}
									alt=""
								/>
							</div>
						)}
					</div>
					<label htmlFor="submit" className="nextButton">
						<Button variant="contained" color="primary" component="span">
							{display ? "update" : "Next"}
						</Button>
					</label>
					<input type="submit" id="submit" style={{ display: "none" }} />
				</form>
			</div>
		</>
	);
}
