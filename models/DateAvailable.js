module.exports = (sequelize, DataTypes) => {
  const DateAvailable = sequelize.define(
    "DateAvailable",
    {
      weekday: {
        type: DataTypes.ENUM(0, 1, 2, 3, 4, 5, 6),
        allowNull: false,
        validate: { notEmpty: true },
      },
      fromTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: { notEmpty: true },
      },
      toTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: { notEmpty: true },
      },
    },
    { underscord: true }
  );
  DateAvailable.associate = (db) => {
    DateAvailable.belongsTo(db.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return DateAvailable;
};
