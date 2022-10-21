const { User, Transaction } = require("../models");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const AppError = require("../utils/appError");
const {
  TASK_ORDER,
  TASK_TOPUP,
  TASK_WITHDRAW,
  STATUS_PENDING,
  STATUS_SUCCESS,
} = require("../config/constants");

exports.createTransaction = async (req, res, next) => {
  try {
    const { task, amount } = req.body;
    if (task === TASK_TOPUP) {
      if (!amount || amount == 0) {
        throw new AppError("amount cant be zero", 400);
      }
      if (req.files?.slipImage) {
        const imageURL = await cloudinary.upload(req.files.slipImage[0].path);
        await Transaction.create({
          receiverId: req.user.id,
          senderId: 1,
          amount,
          task,
          slipImage: imageURL,
          status: STATUS_PENDING,
        });
        return res
          .status(201)
          .json({ message: "create topup transaction success" });
      }
      throw new AppError("slipImage is required", 400);
    }
    if (task === TASK_WITHDRAW) {
      if (!amount || amount == 0) {
        throw new AppError("amount cant be zero", 400);
      }
      if (req.user.wallet < amount) {
        throw new AppError("not enough money in wallet to withdraw", 400);
      }
      const Newwallet = req.user.wallet - amount;
      await User.update({ wallet: Newwallet }, { where: { id: req.user.id } });
      await Transaction.create({
        receiverId: 1,
        senderId: req.user.id,
        amount,
        task,
        status: STATUS_PENDING,
      });
      return res
        .status(201)
        .json({ message: "create withdraw transaction success" });
    }
    throw new AppError("task invalid", 400);
  } catch (err) {
    next(err);
  } finally {
    if (req.files?.slipImage) {
      fs.unlinkSync(req.files.slipImage[0].path);
    }
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { status, amount, comment } = req.body;
    selectedTransaction = await Transaction.findOne({ where: { id: id } });

    if (selectedTransaction.task === TASK_TOPUP) {
      if (status === STATUS_SUCCESS) {
        const topupUser = await User.findOne({
          where: { id: selectedTransaction.receiverId },
        });
        const newWallet = amount
          ? +topupUser.wallet + +amount
          : +topupUser.wallet + +selectedTransaction.amount;
        await User.update(
          { wallet: newWallet },
          { where: { id: topupUser.id } }
        );
        await Transaction.update(
          {
            status,
            comment,
            amount: amount ? amount : selectedTransaction.amount,
          },
          { where: { id: id } }
        );
        return res
          .status(201)
          .json({ message: "update topup transaction success" });
      }
      throw new AppError("status invalid", 400);
    }
    if (selectedTransaction.task === TASK_WITHDRAW) {
      if (status === STATUS_SUCCESS) {
        await Transaction.update({ status, comment }, { where: { id: id } });
        return res
          .status(201)
          .json({ message: "update withdraw transaction success" });
      }
      throw new AppError("status invalid", 400);
    }
    throw new AppError("task invalid", 400);
  } catch (err) {
    next(err);
  }
};
