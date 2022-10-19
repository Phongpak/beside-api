const { User } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const AppError = require("../utils/appError");
const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY || "private_key", {
    expiresIn: process.env.JWT_EXPIRES || "1d",
  });

exports.register = async (req, res, next) => {
  try {
    const user = req.body;

    const {
      firstName,
      lastName,
      email,
      mobile,
      birthDate,
      gender,
      password,
      nationality,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobile ||
      !birthDate ||
      !gender ||
      !password ||
      !nationality
    ) {
      throw new AppError('Input require', 400);
    }
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: user.email },
          { mobile: user.mobile },
          { firstName: user.firstName, lastName: user.lastName },
        ],
      },
    });
    if (existingUser) {

      console.log("test", existingUser);
      throw new AppError("User already existed", 400);
    }

    const isEmail = validator.isEmail(user.email);
    const isMobile = validator.isMobilePhone(user.mobile, ["th-TH"]);
    console.log(isEmail);

    if (!isEmail || !isMobile) {
      throw new AppError("Invalid email or mobile");
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;


    await User.create(user);

    res.status(200).json({ message: 'Register success' });

  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string") {
      throw new AppError("email address  password is invalid", 400);
    }

    const user = await User.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new AppError("email address or password is invalid", 400);
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      throw new AppError("email address or password is invalid", 400);
    }
    const token = genToken({ id: user.id });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getUser = (req, res, next) => {
  try {
    res.status(201).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};
