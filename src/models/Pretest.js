const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Kelas = require("./Kelas");

const Pretest = sequelize.define(
  "Pretest",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    kelas_id: { type: DataTypes.BIGINT },
    pertanyaan: { type: DataTypes.TEXT, allowNull: false },
    pilihan_a: { type: DataTypes.STRING },
    pilihan_b: { type: DataTypes.STRING },
    pilihan_c: { type: DataTypes.STRING },
    pilihan_d: { type: DataTypes.STRING },
    jawaban_benar: { type: DataTypes.STRING },
    urutan: { type: DataTypes.INTEGER },
  },
  {
    tableName: "pretest",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Pretest.belongsTo(Kelas, { foreignKey: "kelas_id", as: "kelas" });

module.exports = Pretest;
