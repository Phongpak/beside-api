const { User, DateAvailable, DateUnavailable } = require("../models");
const AppError = require("../utils/appError");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);

exports.dateCreate = async (req, res, next) => {
  try {
    const { weekday, fromTime, toTime } = req.body;
    const check = await DateAvailable.findAll({
      where: { user: req.user.id },
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
// const a = new Date(Date.now());
// const d = a.getDay();
// console.log(d);

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
    const create = req.body.map((item) => {
      return DateUnavailable.create({
        unavailableDate: item.date,
        fromTime: item.fromTime,
        toTime: item.toTime,
        userId: req.user.id,
      });
    });
    await Promise.all(create);

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
    await DateAvailable.destroy({ where: { id } });

    res.status(201).json({ message: "delete done" });
  } catch (err) {
    next(err);
  }
};
