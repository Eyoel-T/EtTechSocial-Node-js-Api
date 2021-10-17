//jshint esversion:6

const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: String,
		},
		sender: {
			type: String,
		},
		text: {
			type: String,
		},
		profilePicture: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
