module.exports = (sequelize, DataTypes) => {
  const profileImages = sequelize.define(
    "profileImages",
    {
      Image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
    },
    { underscord: true }
  );
  profileImages.associate = (db) => {
    profileImages.belongsTo(db.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return profileImages;
};
