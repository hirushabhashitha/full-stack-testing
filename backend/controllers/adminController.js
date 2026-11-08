// controllers/adminController.js
const adminService = require('../services/adminService');

// සියලුම Users ලා ලබා ගැනීම
exports.getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message || 'පරිශීලකයින් ලබා ගැනීමට නොහැකි විය.' });
    }
};

// User ගිණුමක් Block / Unblock කිරීම
exports.toggleUserStatus = async (req, res) => {
    try {
        const updatedUser = await adminService.toggleUserStatus(req.params.id);
        res.json({
            message: `පරිශීලක ගිණුම සාර්ථකව ${updatedUser.status === 'blocked' ? 'Block කරන ලදී' : 'Active කරන ලදී'}.`,
            user: updatedUser
        });
    } catch (error) {
        const statusCode = error.message === 'පරිශීලකයා හමු නොවීය.' ? 404 : 500;
        res.status(statusCode).json({ message: error.message || 'ගිණුමේ තත්ත්වය වෙනස් කිරීමට නොහැකි විය.' });
    }
};

// User කෙනෙකු මකා දැමීම
exports.deleteUser = async (req, res) => {
    try {
        await adminService.deleteUser(req.params.id);
        res.json({ message: 'පරිශීලක ගිණුම සාර්ථකව මකා දමන ලදී.' });
    } catch (error) {
        const statusCode = error.message === 'පරිශීලකයා හමු නොවීය.' ? 404 : 500;
        res.status(statusCode).json({ message: error.message || 'පරිශීලකයා මකා දැමීමට නොහැකි විය.' });
    }
};