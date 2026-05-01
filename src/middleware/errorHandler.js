const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Terjadi kesalahan server";

  if (err.name === "SequelizeUniqueConstraintError") {
    return res
      .status(409)
      .json({ message: "Data sudah ada, tidak boleh duplikat" });
  }
  if (err.name === "SequelizeValidationError") {
    return res
      .status(400)
      .json({ message: err.errors.map((e) => e.message).join(", ") });
  }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ message: "Token tidak valid atau sudah kadaluarsa" });
  }

  return res.status(status).json({ message });
};

module.exports = errorHandler;
