const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const KategoriKelas = require("./KategoriKelas");

const Kelas = sequelize.define(
  "Kelas",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    kategori_id: { type: DataTypes.BIGINT },
    judul: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    deskripsi: { type: DataTypes.TEXT },
    thumbnail: { type: DataTypes.STRING },
    harga: { type: DataTypes.DECIMAL(10, 0) },
    bahasa: { type: DataTypes.STRING, defaultValue: "Bahasa Indonesia" },
  },
  {
    tableName: "kelas",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

Kelas.belongsTo(KategoriKelas, { foreignKey: "kategori_id", as: "kategori" });

module.exports = Kelas;
