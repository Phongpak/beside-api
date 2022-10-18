const {
  SEX_MALE,
  SEX_FEMALE,
  SEX_NOTSPECIFIC,
  STATUS_PENDING,
  STATUS_SUCCESS,
  STATUS_REJECT,
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: { notEmpty: true },
      },
      isVerify: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      penName: {
        type: DataTypes.STRING,
        validate: { notEmpty: true },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      hobby: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idCardImage: {
        type: DataTypes.STRING,
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: { notEmpty: true },
      },
      gender: {
        type: DataTypes.ENUM(SEX_MALE, SEX_FEMALE, SEX_NOTSPECIFIC),
        allowNull: false,
        validate: { notEmpty: true },
      },
      sexuallyInterested: {
        type: DataTypes.ENUM(SEX_MALE, SEX_FEMALE, SEX_NOTSPECIFIC),
      },
      bookBankImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bookAccountNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wallet: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: { notEmpty: true },
        defaultValue: 0,
      },
      averageRating: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      isBan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: { notEmpty: true },
      },
      providerRequestStatus: {
        type: DataTypes.ENUM(STATUS_PENDING, STATUS_SUCCESS, STATUS_REJECT),
        allowNull: true,
      },
    },
    { underscored: true }
  );
  User.associate = (db) => {
    User.hasMany(db.Order, {
      foreignKey: {
        name: 'customerId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(db.Order, {
      foreignKey: {
        name: 'providerId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(db.OrderChat, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(db.Transaction, {
      foreignKey: {
        name: 'senderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(db.Transaction, {
      foreignKey: {
        name: 'receiverId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(db.PinLocation, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(db.ProfileImages, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(db.SupportChat, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasOne(db.SupportChat, {
      foreignKey: {
        name: 'userRoom',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasOne(db.DateAvailable, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };
  return User;
};
