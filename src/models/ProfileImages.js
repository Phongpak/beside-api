module.exports = (sequelize, DataTypes) => {
  const ProfileImages = sequelize.define(
    "ProfileImages",
    {
      Image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
    },
    { underscord: true }
  );
  ProfileImages.associate = (db) => {
    ProfileImages.belongsTo(db.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return ProfileImages;
};
