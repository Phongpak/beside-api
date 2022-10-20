module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        validate: { notEmpty: true },
      },
      task: {
        type: DataTypes.ENUM("TOPUP", "ORDER", "WITHDRAW"),
        allowNull: false,
        validate: { notEmpty: true },
      },
      status: {
        type: DataTypes.ENUM("PENDING", "SUCCESS"),
        allowNull: false,
        defaultValue: "PENDING",
        validate: { notEmpty: true },
      },
      slipImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { underscord: true }
  );
  Transaction.associate = (db) => {
    Transaction.belongsTo(db.User, {
      foreignKey: {
        name: "senderId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Transaction.belongsTo(db.User, {
      foreignKey: {
        name: "receiverId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Transaction.belongsTo(db.Order, {
      foreignKey: {
        name: "orderId",
        allowNull: true,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Transaction;
};
