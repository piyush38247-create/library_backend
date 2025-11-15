import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';


// Verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    let token;

       if(req.cookies && req.cookies.token){
        token = req.cookies.token 
    }
    else if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    // if (!decoded.libraryId) {
    //   return res.status(403).json({ message: 'Library context missing in token' });
    // }
    req.user = {
      id: decoded.id,
      studentId: decoded.studentId,
      libraryId: decoded.libraryId,
      role: decoded.role
    };
    const user = await User.findById(decoded.id).select('-password');
  

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token or user inactive.' });
    }


    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};




// Check if user has specific permission
export const authorize = (module, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Super admin has all permissions
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Check specific permission
    if (!req.user.permissions[module] || !req.user.permissions[module][action]) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

// Check if user is admin or super admin
export const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Check if user is super admin
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
  }
  next();
};



