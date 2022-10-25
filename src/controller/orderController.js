const AppError = require("../utils/appError");
const { User, Order } = require("../models");
const { Op } = require("sequelize");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const {
  STATUS_NULL,
  STATUS_PENDING,
  STATUS_INPROGRESS,
  STATUS_SUCCESS,
  STATUS_REJECT,
} = require("../config/constants");

exports.createOrder = async (req, res, next) => {
  try {
    const { appointmentDate, fromTime, toTime, customerId, providerId } =
      req.body;
    const range = moment.range(fromTime, toTime);
    // const hours = Array.from(range.by("hour", { excludeEnd: true }));
    // console.log(hours);
    res.status(201).json({ messsage: "done" });
  } catch (err) {
    next(err);
  }
};
