const { User, OrderChat } = require("../models");
const { Op } = require("sequelize");

exports.getChatMessage = async (req, res, next) => {
	try {
		const { orderId } = req.params;
		const messages = await OrderChat.findAll({
			where: { orderId: orderId },
			include: [{ model: User }]
		});
		res.status(200).json({ messages });
	} catch (err) {
		next(err);
	}
};

exports.updateIsSeenChatMessage = async (req, res, next) => {
	try {
		const { orderId } = req.params;
		await OrderChat.update(
			{
				isSeen: true
			},
			{
				where: {
					[Op.and]: [
						{ orderId: orderId },
						{ userId: { [Op.not]: req.user.id } }
					]
				}
			}
		);
		res.status(200).json({ message: "update isSeen success" });
	} catch (err) {
		next(err);
	}
};

exports.getUnseenChatMessage = async (req, res, next) => {
	try {
		const { orderId } = req.params;
		const unseenMessages = await OrderChat.findAll({
			where: { [Op.and]: [{ orderId: orderId }, { isSeen: 0 }] }
		});
		res.status(200).json({ unseenMessages });
	} catch (err) {
		next(err);
	}
};
