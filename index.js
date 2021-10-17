//jshint esversion:6
const express = require("express");

const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/user.js");
const authRoute = require("./routes/auth.js");
const postRoute = require("./routes/posts.js");
const conversationRoute = require("./routes/conversations.js");
const messageRoute = require("./routes/messages.js");
const app = express();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http").createServer(app);
const server = http;

const io = require("socket.io")(http, {
	cors: {
		origin: "*",
	},
});

dotenv.config();

// mongoose.connect("mongodb://localhost:27017/socialDB", () => {
// 	console.log("connected to db to local");
// });

//mongoose.connect(
//	"mongodb://localhost:27017/socialDB",
//	{
//		useNewUrlParser: true,
//	},
//	() => {
//		console.log("connect to dB to Local");
//	}
//);

mongoose.connect(process.env.MONGO_DB_URL, () => {
	console.log("connected to db to online");
});

app.use("/images", express.static(path.join(__dirname, "public/images")));
//middleware

app.use(express.json());
app.use(cors());
app.use(helmet()); //secure the request that is comming to server
app.use(morgan("common")); //log the requets status timestamp and others
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images");
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
	try {
		return res.status(200).json("File uploded successfully");
	} catch (error) {
		console.error(error);
	}
});

let users = [];

const addUser = (userId, socketId) => {
	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId });
};

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
	return users.find((user) => user.userId === userId);
};

io.on("connect", (socket) => {
	//when ceonnect

	//take userId and socketId from user
	socket.on("addUser", (userId) => {
		console.log("a user connected.");
		addUser(userId, socket.id);
		io.emit("getUsers", users);
	});

	//send and get message
	socket.on("sendMessage", ({ senderId, receiverId, text, profilePicture }) => {
		const user = getUser(receiverId);
		io.to(user.socketId).emit("getMessage", {
			senderId,
			text,
			profilePicture,
		});
	});

	//when disconnect
	socket.on("disconnect", () => {
		console.log("a user disconnected!");
		removeUser(socket.id);
		io.emit("getUsers", users);
	});
});

app.get("/", (req, res) => {
	res.send("welcome to home route");
});

app.listen(process.env.PORT || 8800, () => {
	console.log("listening on *:3000");
});
