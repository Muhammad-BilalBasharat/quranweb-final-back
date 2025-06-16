function verifyAdminByParam(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Forbidden",
            error: "You do not have permission to access this resource",
        });
    }
    next();
};
function verifyAdminByToken(req, res, next) {
    if (req.userData.role !== "admin") {
        return res.status(403).json({
            message: "Forbidden",
            error: "You do not have permission to access this resource",
        });
    }
    next();
};

export { verifyAdminByParam, verifyAdminByToken};