const cloudinary = require("../utils/cloudinary");
const { ProfileImages } = require("../models");
const AppError = require("../utils/appError");
const fs = require("fs");

exports.updateUser = async (req, res, next) => {
  try {
    const { data } = req.body;
    if (req.files.profileImages) {
      oldProfileImages = await ProfileImages.findAll({
        where: { userId: req.user.id },
      });
      if (oldProfileImages.length > 3) {
        throw new AppError(
          "profileImages are at maximum 3 files upload allowed",
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
    res.status(200).json({ message: "update success" });
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    const multiplePictureUnlinkPromise = req.files.profileImages.map(
      (profileImage) => fs.unlinkSync(profileImage.path)
    );
    multiplePictureUnlinkPromise;
  }
};

exports.deleteProfileImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await ProfileImages.findOne({ where: { id } });
    await image.destroy();
    res.status(201).json({ message: "delete success" });
  } catch (err) {
    next(err);
  }
};
