module.exports = (sequelize, DataTypes) => {
  const OrderChat = sequelize.define(
    "OrderChat",
    {
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
    },
    { underscord: true }
  );
  OrderChat.associate = (db) => {
    OrderChat.belongsTo(db.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return OrderChat;
};
