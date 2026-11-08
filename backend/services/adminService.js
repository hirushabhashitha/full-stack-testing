// services/adminService.js
const User = require('../models/User');
const Product = require('../models/Product');

class AdminService {
    // 1. සියලුම Users ලා ලබා ගැනීම
    async getAllUsers() {
        return await User.find({ role: 'user' }).select('-password');
    }

    // 2. User ගිණුම Block / Unblock කිරීම
    async toggleUserStatus(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('පරිශීලකයා හමු නොවීය.');
        }

        user.status = user.status === 'active' ? 'blocked' : 'active';
        await user.save();
        return user;
    }

    // 3. User කෙනෙකු සහ ඔහුට අයත් Products මකා දැමීම (Cascade Delete)
    async deleteUser(userId) {
        // පළමුව පරිශීලකයාට අදාළ නිෂ්පාදන (Products) මකා දැමීම
        await Product.deleteMany({ userId: userId });

        // පරිශීලක ගිණුම මකා දැමීම
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('පරිශීලකයා හමු නොවීය.');
        }

        return user;
    }
}

module.exports = new AdminService();