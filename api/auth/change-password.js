const User = require('../data/models/user');
const bcrypt = require('bcrypt');

async function changePassword(req, res) {
  try {
    const normalizedLogin = req.normalizedLogin;
    const user = await User.findOne({ normalizedLogin });

    const oldPassword = req.body.oldPassword;
    const oldHashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(oldPassword, oldHashedPassword);
    if (!passwordsMatch) {
      return { status: 404, message: 'Wrong old password.' };
    }

    const newPassword = req.body.newPassword;

    if (oldPassword === newPassword) {
      return { status: 400, message: 'Passwords are the same.' };
    }

    if (newPassword.length < 4) {
      return { status: 400, message: 'New password is too short.' };
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;

    await user.save();

    return { status: 200, message: null };
  } catch (error) {
    return { error };
  }
}

module.exports = changePassword;
