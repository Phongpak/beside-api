module.exports = (sequelize, DataTypes) => {
  const PinLocation = sequelize.define(
    "PinLocation",
    {
      rate: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: { notEmpty: true },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      workingArea: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: { notEmpty: true },
        defaultValue: 5,
      },
    },
    { underscord: true }
  );
  PinLocation.associate = (db) => {
    PinLocation.belongsTo(db.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    PinLocation.hasMany(db.Order, {
      foreignKey: {
        name: "pinId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return PinLocation;
};
