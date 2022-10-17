const { createError } = require('../utils/appError');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      console.log('this is header', authorization);
      createError('unauthenticated1', 401);
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      createError('unauthenticated2', 401);
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || 'private_key'
    );

    const user = await User.findOne({
      where: { id: payload.id },
      attributes: { exclude: 'password' },
    });

    if (!user) {
      createError('unauthenticated3', 401);
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
