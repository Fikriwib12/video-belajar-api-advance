const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Kelas = require("./Kelas");

const ModulKelas = sequelize.define(
  "ModulKelas",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    kelas_id: { type: DataTypes.BIGINT },
    judul: { type: DataTypes.STRING, allowNull: false },
    urutan: { type: DataTypes.INTEGER },
  },
  {
    tableName: "modul_kelas",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ModulKelas.belongsTo(Kelas, { foreignKey: "kelas_id", as: "kelas" });

module.exports = ModulKelas;
