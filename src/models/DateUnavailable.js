module.exports = (sequelize, DataTypes) => {
  const DateUnavailable = sequelize.define(
    "DateUnavailable",
    {
      unavailableDate: {
        type: DataTypes.DATE,
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
  DateUnavailable.associate = (db) => {
    DateUnavailable.belongsTo(db.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return DateUnavailable;
};
