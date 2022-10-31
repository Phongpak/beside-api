const { User, Transaction, ProfileImages } = require("../models");
const AppError = require("../utils/appError");

exports.getUser = async (req, res, next) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
      attributes: { exclude: "password" },
      include: [
        {
          model: ProfileImages,
          attributes: ["id", "Image", "userId"],
        },
      ],
    });
    res.status(201).json({ users });
  } catch (err) {
    next(err);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "firstName", "lastName", "penName", "email"],
          include: [
            {
              model: ProfileImages,
              attributes: ["id", "Image", "userId"],
            },
          ],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "firstName", "lastName", "penName", "email"],
          include: [
            {
              model: ProfileImages,
              attributes: ["id", "Image", "userId"],
            },
          ],
        },
      ],
    });
    res.status(201).json({ transactions });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["id", "firstName", "lastName", "penName", "email"],
          include: [
            {
              model: ProfileImages,
              attributes: ["id", "Image", "userId"],
            },
          ],
        },
        {
          model: User,
          as: "provider",
          attributes: ["id", "firstName", "lastName", "penName", "email"],
          include: [
            {
              model: ProfileImages,
              attributes: ["id", "Image", "userId"],
            },
          ],
        },
      ],
    });
    res.status(201).json({ orders });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.destroy({
      where: { id },
    });
    res.status(201).json({ message: "delete done" });
  } catch (err) {
    next(err);
  }
};
