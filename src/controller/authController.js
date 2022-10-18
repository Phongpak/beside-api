exports.register = async (req, res, next) => {
  try {
    // const { firstName, lastName,email,mobile,birthDate,gender,password,confirmPassword } = req.body
  } catch (err) {
    next(err);
  }
};
