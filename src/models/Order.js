const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Kelas = require("./Kelas");
const User = require("./User");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT },
    kelas_id: { type: DataTypes.BIGINT },
    order_code: { type: DataTypes.STRING, unique: true },
    total_harga: { type: DataTypes.DECIMAL(10, 0) },
    status: { type: DataTypes.STRING },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

Order.belongsTo(User, { foreignKey: "user_id", as: "user" });
Order.belongsTo(Kelas, { foreignKey: "kelas_id", as: "kelas" });

module.exports = Order;
