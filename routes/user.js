//jshint esversion:9
const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
	console.log(req.body);
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json(err);
			}
		}
		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			const returnUser = await User.findById(req.params.id);
			res.status(200).json(returnUser);
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json("You can update only your account");
	}
});

//delete user
router.delete("/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			const user = await User.findByIdAndDelete(req.params.id);
			res.status(200).json("Account has been deleted");
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json("You can delete only your account");
	}
});

//get a user
router.get("/", async (req, res) => {
	const userId = req.query.userId;
	const username = req.query.username;

	try {
		const user = userId
			? await User.findById(userId)
			: await User.findOne({ username: username });
		const { password, updatedAt, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get followings

router.get("/friends/:userId", async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		const friends = await Promise.all(
			user.followings.map((friendId) => {
				return User.findById(friendId);
			})
		);
		let friendList = [];
		friends.map((friend) => {
			const { _id, username, profilePicture } = friend;
			friendList.push({ _id, username, profilePicture });
		});
		res.status(200).json(friendList);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get followers

router.get("/followers/:userId", async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		const followers = await Promise.all(
			user.followers.map((followerId) => {
				return User.findById(followerId);
			})
		);
		let followerList = [];
		followers.map((follower) => {
			const { _id, username, profilePicture } = follower;
			followerList.push({ _id, username, profilePicture });
		});
		res.status(200).json(followerList);
	} catch (err) {
		res.status(500).json(err);
	}
});

//follow a user

router.put("/:id/follow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({ $push: { followings: req.params.id } });
				res.status(200).json("user has benn followed");
			} else {
				console.log(user);
				res.status(200).json("you already follow this user");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("you can't follow your self");
	}
});

//unfollow user

router.put("/:id/unfollow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $pull: { followers: req.body.userId } });
				await currentUser.updateOne({ $pull: { followings: req.params.id } });
				res.status(200).json("user has benn unfollowed");
			} else {
				console.log(user);
				res.status(403).json("you are not his follower this user");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("you can't unfollow your self");
	}
});

//get All user

router.get("/:id/all", async (req, res) => {
	let userList = [];
	try {
		const users = await User.find({});

		users.forEach(function (user) {
			if (user.id != req.params.id) {
				userList.push({
					userId: user.id,
					profilePicture: user.profilePicture,
					username: user.username,
					followers: user.followers.length,
					followings: user.followings.length,
				});
			}
		});

		res.status(200).json(userList);
	} catch (err) {
		res.status(500).json(err);
	}
});

//isFriend api

module.exports = router;
