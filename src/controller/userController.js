const cloudinary = require("../utils/cloudinary");
const AppError = require("../utils/appError");
const fs = require("fs");
const {
  User,
  ProfileImages,
  Order,
  DateAvailable,
  DateUnavailable,
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
} = require("../config/constants");
const { resourceLimits } = require("worker_threads");

exports.updateUser = async (req, res, next) => {
  try {
    const {
      isVerify,
      isBan,
      providerRequestStatus,
      isAdmin,
      penName,
      hobby,
      gender,
      sexuallyInterested,
      bookAccountNumber,
      bankName,
      description,
      language,
      rate,
      lat,
      lng,
      location,
    } = req.body;
    const { id } = req.params;

    if (req.user.id !== +id) {
      if (req.user.isAdmin) {
        await User.update(
          { isVerify, isBan, providerRequestStatus, isAdmin },
          { where: { id: id } }
        );
        res.status(200).json({ message: `update user ${id} by admin success` });
        return;
      }
      throw new AppError("unauthorized", 401);
    }
    if (req.user.id === +id) {
      if (req.files?.profileImages) {
        const oldProfileImages = await ProfileImages.findAll({
          where: { userId: req.user.id },
        });
        if (oldProfileImages.length + req.files.profileImages.length > 3) {
          throw new AppError(
            "error ! profileImages are exceeding maximum 3 files upload allowed",
            400
          );
        }
        const multiplePictureUploadPromise = req.files.profileImages.map(
          (profileImage) => {
            return cloudinary.upload(profileImage.path);
          }
        );
        const imageURL = await Promise.all(multiplePictureUploadPromise);
        for (const URL of imageURL) {
          await ProfileImages.create({ Image: URL, userId: req.user.id });
        }
      }
      if (req.files?.idCardImage) {
        const oldIdCardImage = req.user.idCardImage;
        const imageURL = await cloudinary.upload(
          req.files.idCardImage[0].path,
          oldIdCardImage ? cloudinary.getPublicId(oldIdCardImage) : undefined
        );
        await User.update({ idCardImage: imageURL }, { where: { id: id } });
      }
      if (req.files?.bookBankImage) {
        const oldBookBankImage = req.user.bookBankImage;
        const imageURL = await cloudinary.upload(
          req.files.bookBankImage[0].path,
          oldBookBankImage
            ? cloudinary.getPublicId(oldBookBankImage)
            : undefined
        );
        await User.update({ bookBankImage: imageURL }, { where: { id: id } });
      }

      if (providerRequestStatus !== undefined) {
        if (providerRequestStatus !== "PENDING") {
          throw new AppError(
            "error ! user only allowed to update providerRequestStatus to 'PENDING' only",
            401
          );
        }
      }

      await User.update(
        {
          language,
          rate,
          lat,
          lng,
          penName,
          hobby,
          gender,
          sexuallyInterested,
          bookAccountNumber,
          bankName,
          description,
          providerRequestStatus,
          location,
        },
        { where: { id: id } }
      );

      res.status(200).json({ message: "user update success" });
    }
  } catch (err) {
    next(err);
  } finally {
    if (req.files?.profileImages) {
      const multiplePictureUnlinkPromise = req.files.profileImages.map(
        (profileImage) => {
          return fs.unlinkSync(profileImage.path);
        }
      );
      multiplePictureUnlinkPromise;
    }
    if (req.files?.idCardImage) {
      fs.unlinkSync(req.files.idCardImage[0].path);
    }
    if (req.files?.bookBankImage) {
      fs.unlinkSync(req.files.bookBankImage[0].path);
    }
  }
};

exports.deleteProfileImage = async (req, res, next) => {
  const { id } = req.params;
  try {
    const image = await ProfileImages.findOne({ where: { id: id } });
    if (image.userId !== req.user.id) {
      throw new AppError(
        "error ! user only allow to delete there own profileImages",
        401
      );
    }
    await cloudinary.destroy(cloudinary.getPublicId(image.Image));
    await image.destroy();
    res.status(201).json({ message: "delete success" });
  } catch (err) {
    next(err);
  }
};

exports.getAllProviderByLatLng = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.params;
    const { appointmentDate, fromTime, toTime } = req.body;
    function CoordDistance(lat, lng) {
      RadiansLat = (lat * Math.PI) / 180;
      RadiansLat2 = ((+lat + 1) * Math.PI) / 180;
      RadiansLng = (lng * Math.PI) / 180;
      RadiansLng2 = ((+lng + 1) * Math.PI) / 180;

      return (
        6371 *
        Math.acos(
          Math.sin(RadiansLat) * Math.sin(RadiansLat2) +
            Math.cos(RadiansLat) *
              Math.cos(RadiansLat2) *
              Math.cos(RadiansLng2 - RadiansLng)
        )
      );
    }

    const distance = CoordDistance(lat, lng);
    const calculated = radius / distance;

    const providers = await User.findAll({
      where: {
        [Op.and]: [
          {
            [Op.and]: [
              { lat: { [Op.gte]: +lat - calculated } },
              { lat: { [Op.lte]: +lat + calculated } },
            ],
          },
          {
            [Op.and]: [
              { lng: { [Op.gte]: +lng - calculated } },
              { lng: { [Op.lte]: +lng + calculated } },
            ],
          },
          {
            isBan: false,
            providerRequestStatus: STATUS_SUCCESS,
          },
        ],
      },
    });

    //------------------------------------Date Validates

    const selectedWeekday = moment(
      appointmentDate,
      "YYYY-MM-DD hh:mm:ss"
    ).day();
    const selected = moment(appointmentDate, "YYYY-MM-DD hh:mm:ss");
    const selectedDate = moment(appointmentDate, "YYYY-MM-DD hh:mm:ss").date();
    const DateFromTime = moment(
      appointmentDate + " " + fromTime,
      "YYYY-MM-DD hh:mm:ss"
    ).add(1, "seconds");

    const DateToTime = moment(
      appointmentDate + " " + toTime,
      "YYYY-MM-DD hh:mm:ss"
    ).subtract(1, "seconds");

    const multiDateAva = providers.map((item) => {
      return DateAvailable.findAll({
        where: {
          weekday: "" + selectedWeekday,
          fromTime: { [Op.lte]: fromTime },
          toTime: { [Op.gte]: toTime },
          userId: item.dataValues.id,
        },
      });
    });

    const AvaOfUsers = await Promise.all(multiDateAva);
    const multiDateUnava = AvaOfUsers.flat(1).map((item) => {
      if (item.dataValues.userId) {
        return DateUnavailable.findAll({
          where: {
            unavailableDate: selected,
            [Op.or]: [
              {
                fromTime: {
                  [Op.between]: [fromTime, toTime],
                },
              },
              {
                toTime: {
                  [Op.between]: [fromTime, toTime],
                },
              },
            ],
            userId: item.dataValues.userId,
          },
        });
      }
    });

    const unAvaOfUsers = await Promise.all(multiDateUnava);

    const subtract = unAvaOfUsers.flat(1).map((item) => item.userId);
    const RemainsOfUsersByUnava = AvaOfUsers.flat(1).reduce((sum, item) => {
      if (subtract.includes(item.userId)) {
        return sum;
      } else {
        sum.push(item.dataValues);
        return sum;
      }
    }, []);

    const multiDateOrder = RemainsOfUsersByUnava.map((item) => {
      return Order.findAll({
        where: {
          [Op.or]: [
            {
              providerId: item.userId,
              appointmentDate: selected,
              status: STATUS_INPROGRESS,
              [Op.or]: [
                {
                  fromTime: {
                    [Op.between]: [fromTime, toTime],
                  },
                },
                {
                  toTime: {
                    [Op.between]: [fromTime, toTime],
                  },
                },
              ],
            },
            {
              providerId: item.userId,
              appointmentDate: selected,
              status: STATUS_SUCCESS,
              [Op.or]: [
                {
                  fromTime: {
                    [Op.between]: [fromTime, toTime],
                  },
                },
                {
                  toTime: {
                    [Op.between]: [fromTime, toTime],
                  },
                },
              ],
            },
          ],
        },
      });
    });
    const OrderOfUsers = await Promise.all(multiDateOrder);
    const subtractOrder = OrderOfUsers.flat(1).map((item) => {
      return item.dataValues.providerId;
    });

    const RemainsOfUsersByOrder = RemainsOfUsersByUnava.flat(1).reduce(
      (sum, item) => {
        if (subtractOrder.includes(item.userId)) {
          return sum;
        } else {
          sum.push(item);
          return sum;
        }
      },
      []
    );

    const allUsers = RemainsOfUsersByOrder.map((item) => {
      return item.userId;
    });

    const AvailableProviders = allUsers.map((item) => {
      return User.findOne({
        where: {
          id: item,
        },
        attributes: { exclude: "password" },
      });
    });

    const finalAvailableProviders = await Promise.all(AvailableProviders);
    res.status(201).json({ finalAvailableProviders });
  } catch (err) {
    next(err);
  }
};

exports.getProfileImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profileImages = await ProfileImages.findAll({
      where: { userId: id },
    });
    res.status(201).json({ profileImages });
  } catch (err) {
    next(err);
  }
};

exports.getUserProfiles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findAll({
      where: { id },
      attributes: { exclude: "password" },
      include: [
        {
          model: ProfileImages,
          attributes: ["id", "Image", "userId"],
        },
        {
          model: Order,
          as: "provider",
        },
      ],
    });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};
