const { User, pinLocation } = require("../models");
const AppError = require("../utils/appError");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);

exports.pinCreate = async (req, res, next) => {
  try {
    const { rate, lat, lng } = req.body;
    await pinLocation.create({
      rate,
      lat,
      lng,
      userId: req.user.id,
    });

    res.status(201).json({ message: "create done" });
  } catch (err) {
    next(err);
  }
};

exports.pinDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const selected = await pinLocation.findOne({ where: { id } });

    if (selected.userId != req.user.id) {
      throw new AppError("cant delete others pinLocation", 400);
    }
    await pinLocation.destroy({ where: { id } });

    res.status(201).json({ message: "delete done" });
  } catch (err) {
    next(err);
  }
};
