const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ModulKelas = require("./ModulKelas");

const Material = sequelize.define(
  "Material",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    modul_id: { type: DataTypes.BIGINT },
    judul: { type: DataTypes.STRING, allowNull: false },
    tipe: { type: DataTypes.STRING },
    konten: { type: DataTypes.TEXT },
    file_url: { type: DataTypes.STRING },
    durasi_menit: { type: DataTypes.INTEGER },
    urutan: { type: DataTypes.INTEGER },
  },
  {
    tableName: "material",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Material.belongsTo(ModulKelas, { foreignKey: "modul_id", as: "modul" });

module.exports = Material;
