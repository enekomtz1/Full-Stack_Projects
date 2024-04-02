import Conversation from "../Models/conversation.model.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};
