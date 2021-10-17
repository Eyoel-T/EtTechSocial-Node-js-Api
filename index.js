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

dotenv.config();

// mongoose.connect("mongodb://localhost:27017/socialDB", () => {
// 	console.log("connected to db to local");
// });

// mongoose.connect(
// 	"mongodb://localhost:27017/socialDB",
// 	{
// 		useNewUrlParser: true,
// 	},
// 	() => {
// 		console.log("connect to dB to Local");
// 	}
// );

mongoose.connect(process.env.MONGO_DB_URL, () => {
	console.log("connected to db to online");
});

app.use("/images", express.static(path.join(__dirname, "public/images")));
//middleware

app.use(express.json());
app.use(cors({ origin: "https://musing-franklin-75622c.netlify.app" }));
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

// app.use(express.static(path.join(__dirname, "/client/build")));

// app.get("*", function (req, res) {
// 	res.sendFile("index.html", { root: __dirname }, function (err) {
// 		if (err) {
// 			res.status(500).send(err);
// 		}
// 	});
// });

// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "/client/build", "index.tml"));
// });

app.get("/", (req, res) => {
	res.send("welcome to home route");
});

app.listen(process.env.PORT || 8800, () => {
	console.log("server running in port 8800");
});
