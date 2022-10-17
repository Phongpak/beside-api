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
  return PinLocation;
};
