const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const KategoriKelas = sequelize.define(
  "KategoriKelas",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    icon: { type: DataTypes.STRING },
  },
  {
    tableName: "kategori_kelas",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);
module.exports = KategoriKelas;
