const restrictTo = (...roles) => {
  return (req, _, next) => {
    const { role } = req.user;

    if (!roles.includes(role)) {
      req.pgClient = null;
      return next(new AppError("Forbidden. Access denied.", 403));
    }

    next();
  };
};

export default restrictTo;
