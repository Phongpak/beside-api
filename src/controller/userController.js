const cloudinary = require("../utils/cloudinary");
const AppError = require("../utils/appError");
const fs = require("fs");
const { User, ProfileImages } = require("../models");
const { Op } = require("sequelize");
const {
  STATUS_NULL,
  STATUS_PENDING,
  STATUS_INPROGRESS,
  STATUS_SUCCESS,
  STATUS_REJECT,
} = require("../config/constants");

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
  const { lat, lng, radius } = req.params;
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

  try {
    const provider = await User.findAll({
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
          },
        ],
      },
    });

    res.status(201).json({ provider });
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
