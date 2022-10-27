const AppError = require("../utils/appError");
const {
  User,
  Order,
  DateAvailable,
  DateUnavailable,
  Transaction,
  ProfileImages,
} = require("../models");
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
  TASK_ORDER,
} = require("../config/constants");

exports.createOrder = async (req, res, next) => {
  try {
    //------------------------------------Variables
    const {
      appointmentDate,
      fromTime,
      toTime,
      providerId,
      descriptionm,
      lat,
      lng,
      location,
    } = req.body;
    const customerId = req.user.id;
    if (
      !appointmentDate ||
      !fromTime ||
      !toTime ||
      !providerId ||
      !customerId
    ) {
      throw new AppError(
        "rerquire appointmentDate ,fromTime ,toTime ,providerId"
      );
    }

    const provider = await User.findOne({ where: { id: providerId } });

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
    //------------------------------------Basic Validates
    if (DateToTime.isBefore(DateFromTime)) {
      throw new AppError("cant select totime as before fromtime");
    }
    if (customerId == providerId) {
      throw new AppError("customer and provider cant be same person !");
    }
    if (provider.providerRequestStatus !== STATUS_SUCCESS) {
      throw new AppError("provider is not provider");
    }
    if (fromTime === toTime) {
      throw new AppError("cant select fromtime and totime as same hour");
    }
    const range = moment.range(DateFromTime, DateToTime);
    const hours = Array.from(range.by("hour"));

    const rentPriceTotal = provider.rate * hours.length;
    const customerToProviderAmount = rentPriceTotal * 0.93;
    const userToAdminAmount = rentPriceTotal * 0.07;

    if (req.user.wallet < rentPriceTotal) {
      throw new AppError("not enough money in wallet");
    }
    //------------------------------------Date Validates
    const dateAva = await DateAvailable.findAll({
      where: { userId: providerId },
    });
    const dateUnava = await DateUnavailable.findAll({
      where: { userId: providerId },
    });
    const selectedDateOrders = await Order.findAll({
      where: { providerId, appointmentDate, status: STATUS_INPROGRESS },
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
        const rangeContain = moment.range(DateFromTime, DateToTime);
        const isContains =
          rangeContain.contains(DateFromTimeMap) ||
          rangeContain.contains(DateToTimeMap);

        if (
          (selectedDateFromUnava === selectedDate && isUnavailable == true) ||
          isContains == true
        ) {
          return true;
        }
      });
      if (dateUnavaMap) {
        throw new AppError("not available because of DateUnavailable");
      } else if (!dateUnavaMap) {
        const selectedDateOrdersMap = selectedDateOrders.some((item) => {
          const formattedDate = moment(item.appointmentDate).format(
            "YYYY-MM-DD"
          );

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

          if (isUnavailable == true) {
            return true;
          }
        });
        if (selectedDateOrdersMap) {
          throw new AppError("not available because of Order");
        } else if (!selectedDateOrdersMap) {
          const order = await Order.create({
            appointmentDate,
            customerId,
            providerId,
            fromTime,
            toTime,
            rentPriceTotal,
            description,
            status: STATUS_PENDING,
            lat,
            lng,
            location,
          });
          await Transaction.create({
            receiverId: providerId,
            senderId: customerId,
            amount: customerToProviderAmount,
            task: TASK_ORDER,
            orderId: order.id,
            status: STATUS_PENDING,
          });
          await Transaction.create({
            receiverId: 1,
            senderId: customerId,
            amount: userToAdminAmount,
            task: TASK_ORDER,
            orderId: order.id,
            status: STATUS_PENDING,
          });
          const newWallet = req.user.wallet - rentPriceTotal;
          await User.update(
            { wallet: newWallet },
            { where: { id: req.user.id } }
          );

          res.status(201).json({ order });
        }
      }
    } else if (!dateAvaMap) {
      throw new AppError("not available because of DateAvailable");
    }
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      status,
      providerReviewDescription,
      providerReviewRating,
      customerReviewDescription,
      customerReviewRating,
    } = req.body;
    const order = await Order.findOne({ where: { id } });
    //------------------------------------CUSTOMER
    if (order.customerId == req.user.id) {
      //--------SUCCESS COMMENT
      if (
        order.status == STATUS_SUCCESS &&
        !order.providerReviewDescription &&
        !order.providerReviewRating
      ) {
        await Order.update(
          {
            providerReviewDescription,
            providerReviewRating,
          },
          { where: { id } }
        );
        res.status(201).json({ message: "update done" });
      }
    }
    //------------------------------------PROVIDER
    if (order.providerId == req.user.id) {
      //--------INPROGRESS
      if (status == STATUS_INPROGRESS && order.status == STATUS_PENDING) {
        await Order.update(
          {
            status: STATUS_INPROGRESS,
          },
          { where: { id } }
        );

        res.status(201).json({ message: "update done" });
      }
      //--------SUCCESS
      if (status == STATUS_SUCCESS && order.status == STATUS_INPROGRESS) {
        const formattedDate = moment(order.appointmentDate).format(
          "YYYY-MM-DD"
        );
        const orderDate = moment(
          formattedDate + " " + order.toTime,
          "YYYY-MM-DD hh:mm:ss"
        );
        const nowDate = moment();

        if (nowDate.isAfter(orderDate)) {
          await Order.update(
            {
              status: STATUS_SUCCESS,
            },
            { where: { id } }
          );

          await Transaction.update(
            {
              status: STATUS_SUCCESS,
            },
            { where: { orderId: order.id } }
          );
          const transac = await Transaction.findOne({
            where: { receiverId: req.user.id, orderId: order.id },
          });

          const newWallet = req.user.wallet + transac.amount;

          await User.update(
            { wallet: newWallet },
            { where: { id: req.user.id } }
          );
          res.status(201).json({ message: "update done" });
        }
        throw new AppError(
          "Can finish the order only after pass the appointment time"
        );
      }
      //--------REJECT
      if (status == STATUS_REJECT && order.status == STATUS_PENDING) {
        await Order.update(
          {
            status: STATUS_REJECT,
          },
          { where: { id } }
        );
        await Transaction.destroy({
          where: { orderId: order.id },
        });
        const customer = await User.findOne({
          where: { id: order.customerId },
        });
        const newWallet = customer.wallet + order.rentPriceTotal;

        await User.update(
          { wallet: newWallet },
          { where: { id: order.customerId } }
        );
        res.status(201).json({ message: "update done" });
      }
      //--------SUCCESS COMMENT
      if (
        order.status == STATUS_SUCCESS &&
        !order.customerReviewDescription &&
        !order.customerReviewRating
      ) {
        await Order.update(
          {
            customerReviewDescription,
            customerReviewRating,
          },
          { where: { id } }
        );
        res.status(201).json({ message: "update done" });
      }
      throw new AppError("status or order status is invalid");
    }
    //------------------------------------ADMIN
    if (
      order.customerId != req.user.id &&
      order.providerId != req.user.id &&
      req.user.isAdmin
    ) {
      //--------REJECT
      if (
        (status == STATUS_REJECT && order.status == STATUS_PENDING) ||
        order.status == STATUS_INPROGRESS
      ) {
        await Order.update(
          {
            status: STATUS_REJECT,
          },
          { where: { id } }
        );
        await Transaction.destroy({
          where: { orderId: order.id },
        });
        const customer = await User.findOne({
          where: { id: order.customerId },
        });
        const newWallet = customer.wallet + order.rentPriceTotal;

        await User.update(
          { wallet: newWallet },
          { where: { id: order.customerId } }
        );

        res.status(201).json({ message: "update done" });
      }
      throw new AppError("status or order status is invalid");
    }
    throw new AppError("something is invalid");
  } catch (err) {
    next(err);
  }
};

exports.getOrdersById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orders = await Order.findAll({
      where: {
        [Op.or]: [{ providerId: id }, { customerId: id }],
      },
      include: [
        {
          model: User,
          as: "customer",
          attributes: ["id", "firstName", "lastName", "penName"],
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
          attributes: ["id", "firstName", "lastName", "penName"],
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
