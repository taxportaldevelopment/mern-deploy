const User = require("../modules/AuthModules");
const jwt = require("jsonwebtoken");

// ✅ Middleware to protect routes (authentication)
exports.protectRouter = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ success: false, error: "Please login first" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }

    if (!decoded?.userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid payload" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRouter middleware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
      return next();
    }
    return res.status(403).json({ error: "Forbidden: Admins only" });
  } catch (error) {
    console.error("Error in isAdmin middleware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// super admin middleware
exports.isSuperAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "superadmin") {
      return res.status(403).json({ error: "Forbidden: Super Admins only" });
    }
    next();
  } catch (error) {
    console.error("Error in isSuperAdmin middleware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Middleware to check if user is logged in
exports.isLoggedIn = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }
    next();
  } catch (error) {
    console.error("Error in isLoggedIn middleware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};