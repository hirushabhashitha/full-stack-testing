const authService = require('../services/authService');

// 1. REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. VERIFY REGISTER OTP
exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyRegisterOtp(email, otp);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 4. GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.userId || req.user?.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// 5. UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateUserProfile(req.userId || req.user?.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 6. DELETE ACCOUNT AND ALL DATA
exports.deleteUserProfile = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const result = await authService.deleteAccountAndData(userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting account',
      error: error.message
    });
  }
};

// 7. FORGOT PASSWORD (Send OTP)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 8. RESET PASSWORD (Verify OTP & Update Password)
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword(email, otp, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 9. REFRESH TOKEN (මෙන්න මෙතන exports එක්ක නිවැරදි කර ඇත)
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};

// 10. LOGOUT CONTROLLER
exports.logout = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const result = await authService.logoutUser(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};