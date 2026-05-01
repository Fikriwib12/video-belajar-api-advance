const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Tutor = sequelize.define(
  "Tutor",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT },
    nama: { type: DataTypes.STRING, allowNull: false },
    foto: { type: DataTypes.STRING },
    jabatan: { type: DataTypes.STRING },
    perusahaan: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
  },
  {
    tableName: "tutor",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

Tutor.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = Tutor;
