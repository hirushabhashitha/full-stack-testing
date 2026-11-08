console.log("📌 authMiddleware file එක වැඩ කරනවා!");

const jwt = require('jsonwebtoken');

// 1. Token එක හරියට තියෙනවද කියලා බලන Middleware එක
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // මෙතැනදී ඔයාගේ token එකේ හැටියට req.user හෝ req.userId පාවිච්චි කරන්න පුළුවන්.
      // adminOnly middleware එක වැඩ කරන්න නම් req.user විදිහට දාන එක වඩාත් හොදයි (req.user = decoded).
      req.user = decoded; 
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. Admin ද යන්න පරීක්ෂා කරන Middleware එක
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Admin නම් ඊළඟ Function එකට යන්න දෙන්න
  } else {
    return res.status(403).json({ message: 'Access denied. Admins only!' });
  }
};

// Functions දෙකම export කිරීම
module.exports = { protect, adminOnly };