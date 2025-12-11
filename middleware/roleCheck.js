/**
 * Middleware to check if authenticated user is an Admin
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

/**
 * Middleware to check if user is Admin OR Moderator (content managers)
 */
export const isModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin" && req.user.role !== "moderator") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin or Moderator privileges required.",
    });
  }

  next();
};

/**
 * Middleware to check if user has specific role(s)
 * @param {string|string[]} allowedRoles - Role or array of roles allowed
 */
export const hasRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

export default { isAdmin, isModerator, hasRole };
