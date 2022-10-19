const cloudinary = require("../utils/cloudinary");
const { ProfileImages } = require("../models");
const AppError = require("../utils/appError");
const fs = require("fs");
const { User } = require("../models");
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
      firstName,
      lastName,
      penName,
      hobby,
      idCardImage,
      gender,
      sexuallyInterested,
      bookBankImage,
      bookAccountNumber,
      bankName,
      description,
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
      if (req.files.profileImages) {
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
      console.log(providerRequestStatus);

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
          firstName,
          lastName,
          penName,
          hobby,
          idCardImage,
          gender,
          sexuallyInterested,
          bookBankImage,
          bookAccountNumber,
          bankName,
          description,
          providerRequestStatus,
        },
        { where: { id: id } }
      );

      res.status(200).json({ message: "user update success" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    if (req.files.profileImages) {
      const multiplePictureUnlinkPromise = req.files.profileImages.map(
        (profileImage) => fs.unlinkSync(profileImage.path)
      );
      multiplePictureUnlinkPromise;
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
    await image.destroy();
    res.status(201).json({ message: "delete success" });
  } catch (err) {
    next(err);
  }
};
