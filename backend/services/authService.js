const User = require('../models/User');
const Otp = require('../models/Otp');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

class AuthService {
  // Helper: OTP generate karne
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 1. REGISTER USER
  async registerUser(userData) {
    const { username, email, password, role } = userData;

    let userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      throw new Error('Username or Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
      status: 'active', // අලුතින් සාදන විට active ලෙස සැකසීම
    });

    const otpCode = this.generateOTP();
    await Otp.create({ email, otp: otpCode });

    await sendEmail(
      email,
      'Account Verification OTP',
      `Your Registration OTP code is: ${otpCode}. It expires in 5 minutes.`
    );

    return {
      message: 'Registration successful. OTP sent to your email.',
      email: user.email,
    };
  }

  // 2. VERIFY REGISTER OTP
  async verifyRegisterOtp(email, otp) {
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      throw new Error('Invalid or expired OTP');
    }

    await User.findOneAndUpdate({ email }, { isVerified: true });
    await Otp.deleteOne({ _id: validOtp._id });

    return { message: 'Account verified successfully. You can now login.' };
  }

  // 3. LOGIN USER (Role-Based Auth & Block Check)
  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your account first.');
    }

    // ⭐ ගිණුම Block කර ඇත්දැයි පරීක්ෂා කිරීම (Account Blocked Check)
    if (user.status === 'blocked') {
      throw new Error('Your account has been blocked by the admin.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Token madhe role add kele ahe
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    console.log("--- LOGIN SUCCESSFUL FOR ---", user.email);
    console.log("Generated Refresh Token:", refreshToken);

    // Force update in MongoDB and return the updated user document
    const updatedUserFromDB = await User.findByIdAndUpdate(
      user._id,
      { refreshToken: refreshToken },
      { new: true, runValidators: true }
    );

    console.log("=== MONGODB TABLE DATA AFTER FORCED UPDATE ===");
    console.log(updatedUserFromDB);
    console.log("=============================================");

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: updatedUserFromDB._id,
        username: updatedUserFromDB.username,
        email: updatedUserFromDB.email,
        role: updatedUserFromDB.role || 'user',
        status: updatedUserFromDB.status || 'active',
      },
    };
  }

  // 4. GET USER PROFILE
  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // 5. UPDATE USER PROFILE
  async updateUserProfile(userId, updateData) {
    const { username, bio, phone } = updateData;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.username = username || user.username;
    user.bio = bio !== undefined ? bio : user.bio;
    user.phone = phone !== undefined ? phone : user.phone;

    const updatedUser = await user.save();
    return {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      phone: updatedUser.phone,
      role: updatedUser.role,
    };
  }

  // 6. DELETE ACCOUNT AND ALL ASSOCIATED DATA (Cascade Delete)
  async deleteAccountAndData(userId) {
    await Product.deleteMany({ userId: userId });
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new Error('User not found');
    }

    return { message: 'Account and all associated products deleted successfully' };
  }

  // 7. FORGOT PASSWORD
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found with this email');
    }

    const otpCode = this.generateOTP();
    await Otp.create({ email, otp: otpCode });

    await sendEmail(
      email,
      'Password Reset OTP',
      `Your Password Reset OTP code is: ${otpCode}. It expires in 5 minutes.`
    );

    return { message: 'OTP sent to your email for password reset.' };
  }

  // 8. RESET PASSWORD
  async resetPassword(email, otp, newPassword) {
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      throw new Error('Invalid or expired OTP');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await Otp.deleteOne({ _id: validOtp._id });

    return { message: 'Password reset successfully. You can now login.' };
  }

  async refreshAccessToken(incomingRefreshToken) {
    console.log("--- INCOMING REFRESH TOKEN ---", incomingRefreshToken);
    if (!incomingRefreshToken) {
      throw new Error('Refresh token is required');
    }

    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    // ⭐ Refresh token කරන විටත් ගිණුම Block කර ඇත්දැයි බැලීම ආරක්ෂාවට වඩාත් හොඳයි
    if (user.status === 'blocked') {
      throw new Error('Your account has been blocked by the admin.');
    }

    console.log("DB Token:", user.refreshToken);
    console.log("Client Token:", incomingRefreshToken);

    if (user.refreshToken !== incomingRefreshToken) {
      console.log("Token mismatch!!");
      throw new Error('Token is invalid or has been revoked');
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return { accessToken: newAccessToken };
  }

  async logoutUser(userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: '' });
    return { message: 'Logged out successfully' };
  }
}

module.exports = new AuthService();