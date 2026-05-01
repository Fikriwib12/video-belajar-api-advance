const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Kelas = require("./Kelas");
const Order = require("./Order");

const KelasSaya = sequelize.define(
  "KelasSaya",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT },
    kelas_id: { type: DataTypes.BIGINT },
    order_id: { type: DataTypes.BIGINT },
    progress_persen: { type: DataTypes.INTEGER, defaultValue: 0 },
    sertifikat_diterima: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "kelas_saya",
    timestamps: true,
    createdAt: "enrolled_at",
    updatedAt: "updated_at",
  }
);

KelasSaya.belongsTo(User, { foreignKey: "user_id", as: "user" });
KelasSaya.belongsTo(Kelas, { foreignKey: "kelas_id", as: "kelas" });
KelasSaya.belongsTo(Order, { foreignKey: "order_id", as: "order" });

module.exports = KelasSaya;
