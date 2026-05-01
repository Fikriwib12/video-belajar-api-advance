const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Kelas = require("./Kelas");
const Tutor = require("./Tutor");

const KelasTutor = sequelize.define(
  "KelasTutor",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    kelas_id: { type: DataTypes.BIGINT },
    tutor_id: { type: DataTypes.BIGINT },
  },
  {
    tableName: "kelas_tutor",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

KelasTutor.belongsTo(Kelas, { foreignKey: "kelas_id", as: "kelas" });
KelasTutor.belongsTo(Tutor, { foreignKey: "tutor_id", as: "tutor" });

module.exports = KelasTutor;
