const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Kelas = require("./Kelas");

const Review = sequelize.define(
  "Review",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT },
    kelas_id: { type: DataTypes.BIGINT },
    rating: { type: DataTypes.FLOAT },
    komentar: { type: DataTypes.TEXT },
  },
  {
    tableName: "review",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Review.belongsTo(User, { foreignKey: "user_id", as: "user" });
Review.belongsTo(Kelas, { foreignKey: "kelas_id", as: "kelas" });

module.exports = Review;
