const { User, DateAvailable, DateUnavailable } = require("../models");
const AppError = require("../utils/appError");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const { Op } = require("sequelize");

exports.dateCreate = async (req, res, next) => {
  try {
    const { weekday, fromTime, toTime } = req.body;
    const check = await DateAvailable.findAll({
      where: { userId: req.user.id },
    });

    const create = await DateAvailable.create({
      weekday,
      fromTime,
      toTime,
      userId: req.user.id,
    });

    res.status(201).json({ message: "create done" });
  } catch (err) {
    next(err);
  }
};

// wave เพิ่ม
exports.getDateAvailable = async (req, res, next) => {
  try {
    const { weekday } = req.params;

    const dateAvailable = await DateAvailable.findOne({
      where: {
        [Op.and]: [{ userId: req.user.id }, { weekday: weekday }],
      },
    });

    res.status(200).json({ dateAvailable });
  } catch (err) {
    next(err);
  }
};
// wave เพิ่ม

exports.dateDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const selected = await DateAvailable.findOne({ where: { id } });

    if (selected.userId != req.user.id) {
      throw new AppError("cant delete others DateAvailable", 400);
    }
    await DateAvailable.destroy({ where: { id } });

    res.status(201).json({ message: "delete done" });
  } catch (err) {
    next(err);
  }
};

exports.dateUnavailableCreate = async (req, res, next) => {
  try {
    const { unavailableDate, fromTime, toTime } = req.body;

    const create = await DateUnavailable.create({
      unavailableDate,
      fromTime,
      toTime,
      userId: req.user.id,
    });

    res.status(201).json({ message: "create done" });
  } catch (err) {
    next(err);
  }
};

exports.dateUnavailableDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const selected = await DateUnavailable.findOne({ where: { id } });

    if (selected.userId != req.user.id) {
      throw new AppError("cant delete others DateUnavailable", 400);
    }
    await DateUnavailable.destroy({ where: { id } }); // แก้ไขเป็น DateUnavailable

    res.status(201).json({ message: "delete done" });
  } catch (err) {
    next(err);
  }
};

// wave เพิ่ม
exports.getUserUnavailableDate = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const unavailableDates = await DateUnavailable.findAll({
      where: { userId: userId },
    });

    res.status(200).json({ unavailableDates });
  } catch (err) {}
};
// wave เพิ่ม
