function verifyAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Forbidden",
            error: "You do not have permission to access this resource",
        });
    }
    next();
};

export default verifyAdmin;