module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      appointmentDate: {
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
      rentPriceTotal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: { notEmpty: true },
      },
      providerReviewDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customerReviewDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      providerReviewRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      customerReviewRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'INPROGRESS', 'SUCCESS', 'REJECT'),
        allowNull: false,
        defaultValue: 'PENDING',
        validate: { notEmpty: true },
      },
    },
    { underscord: true }
  );
  Order.associate = (db) => {
    Order.belongsTo(db.User, {
      foreignKey: {
        name: 'customerId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Order.belongsTo(db.User, {
      foreignKey: {
        name: 'providerId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Order.hasMany(db.OrderChat, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Order.hasMany(db.Transaction, {
      foreignKey: {
        name: 'orderId',
        allowNull: true,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Order.hasMany(db.PinLocation, {
      foreignKey: {
        name: 'pinId',
        allowNull: true,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };
  return Order;
};
