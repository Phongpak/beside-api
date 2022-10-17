module.exports = (sequelize, DataTypes) => {
  const SupportChat = sequelize.define(
    "SupportChat",
    {
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
    },
    { underscord: true }
  );
  SupportChat.associate = (db) => {
    SupportChat.belongsTo(db.User, {
      foreignKey: {
        name: "userRoom",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    SupportChat.belongsTo(db.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return SupportChat;
};
