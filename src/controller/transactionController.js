const { User, Transaction } = require("../models");
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
      const { receiverId } = req.body;
      const senderId = 1;
      if (req.files.slipImage) {
        const imageURL = await cloudinary.upload(req.files.slipImage[0].path);
        await Transaction.create({
          receiverId,
          senderId,
          amount,
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
      const { senderId } = req.body;
      const receiverId = 1;
      if (req.user.wallet < amount) {
        throw new AppError("not enough money in wallet to withdraw", 400);
      }
      const Newwallet = req.user.wallet - amount;
      await User.update({ wallet: Newwallet }, { where: { id: req.user.id } });
      await Transaction.create({
        receiverId,
        senderId,
        amount,
        status: STATUS_PENDING,
      });
    }
    res.status(201).json({ message: "create withdraw transaction success" });
  } catch (err) {
    next(err);
  } finally {
    if (req.files.slipImage) {
      fs.unlinkSync(req.files.slipImage[0].path);
    }
  }
};
