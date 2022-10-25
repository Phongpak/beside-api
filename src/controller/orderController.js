const AppError = require("../utils/appError");
const { User, Order, DateAvailable, DateUnavailable } = require("../models");
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
    if (fromTime === toTime) {
      throw new AppError("cant select fromtime and totime as same hour");
    }

    const selectedWeekday = moment(
      appointmentDate,
      "YYYY-MM-DD hh:mm:ss"
    ).day();
    const selectedDate = moment(appointmentDate, "YYYY-MM-DD hh:mm:ss").date();
    const DateFromTime = moment(
      appointmentDate + " " + fromTime,
      "YYYY-MM-DD hh:mm:ss"
    ).add(1, "seconds");
    const DateToTime = moment(
      appointmentDate + " " + toTime,
      "YYYY-MM-DD hh:mm:ss"
    ).subtract(1, "seconds");
    if (DateToTime.isBefore(DateFromTime)) {
      throw new AppError("cant select totime as before fromtime");
    }
    const range = moment.range(DateFromTime, DateToTime);

    const hours = Array.from(range.by("hour"));
    console.log(hours.length);
    console.log(hours);
    const dateAva = await DateAvailable.findAll({
      where: { userId: providerId },
    });
    const dateUnava = await DateUnavailable.findAll({
      where: { userId: providerId },
    });
    const selectedDateOrders = await Order.findAll({
      where: { providerId },
    });

    const dateAvaMap = dateAva.some((item) => {
      const DateFromTimeMap = moment(
        appointmentDate + " " + item.dataValues.fromTime,
        "YYYY-MM-DD hh:mm:ss"
      );
      const DateToTimeMap = moment(
        appointmentDate + " " + item.dataValues.toTime,
        "YYYY-MM-DD hh:mm:ss"
      );

      const range2 = moment.range(DateFromTimeMap, DateToTimeMap);
      const isAvailable =
        range2.contains(DateFromTime) && range2.contains(DateToTime);

      if (+item.dataValues.weekday === selectedWeekday && isAvailable == true) {
        return true;
      }
    });
    if (dateAvaMap) {
      const dateUnavaMap = dateUnava.some((item) => {
        const formattedDate = moment(item.unavailableDate).format("YYYY-MM-DD");
        const selectedDateFromUnava = moment(
          formattedDate,
          "YYYY-MM-DD hh:mm:ss"
        ).date();

        const DateToTimeMap = moment(
          formattedDate + " " + item.toTime,
          "YYYY-MM-DD hh:mm:ss"
        );

        const DateFromTimeMap = moment(
          formattedDate + " " + item.fromTime,
          "YYYY-MM-DD hh:mm:ss"
        );

        const unavailableRange = moment.range(DateFromTimeMap, DateToTimeMap);
        const isUnavailable =
          unavailableRange.contains(DateFromTime) ||
          unavailableRange.contains(DateToTime);

        if (selectedDateFromUnava === selectedDate && isUnavailable == true) {
          return true;
        }
      });
      if (dateUnavaMap) {
        throw new AppError("not available because of DateUnavailable");
      } else if (!dateUnavaMap) {
        throw new AppError("AVAILABLE");
      }
    } else if (!dateAvaMap) {
      throw new AppError("not available because of DateAvailable");
    }

    res.status(201).json({ messsage: "done" });
  } catch (err) {
    next(err);
  }
};
