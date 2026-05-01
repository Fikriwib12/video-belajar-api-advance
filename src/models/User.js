const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    avatar: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
    email_verified_at: { type: DataTypes.DATE },
    verification_token: { type: DataTypes.STRING },
    deleted_at: { type: DataTypes.DATE },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);
module.exports = User;
