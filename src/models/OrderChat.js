module.exports = (sequelize, DataTypes) => {
	const OrderChat = sequelize.define(
		"OrderChat",
		{
			message: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: { notEmpty: true }
			},
			isSeen: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
				validate: { notEmpty: true }
			}
		},

		{ underscord: true }
	);
	OrderChat.associate = (db) => {
		OrderChat.belongsTo(db.User, {
			foreignKey: {
				name: "userId",
				allowNull: false
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT"
		});
		OrderChat.belongsTo(db.Order, {
			foreignKey: {
				name: "orderId",
				allowNull: false
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT"
		});
	};
	return OrderChat;
};
