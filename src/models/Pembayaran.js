const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./Order");

const Pembayaran = sequelize.define(
  "Pembayaran",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.BIGINT },
    metode: { type: DataTypes.STRING },
    bukti_transfer: { type: DataTypes.STRING },
    transaction_id: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
    jumlah: { type: DataTypes.DECIMAL(10, 0) },
    paid_at: { type: DataTypes.DATE },
  },
  {
    tableName: "pembayaran",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Pembayaran.belongsTo(Order, { foreignKey: "order_id", as: "order" });

module.exports = Pembayaran;
