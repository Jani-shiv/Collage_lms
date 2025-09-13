const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Submission = sequelize.define(
  "Submission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "assignments",
        key: "id",
      },
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("submitted", "graded", "late"),
      defaultValue: "submitted",
    },
  },
  {
    tableName: "submissions",
    indexes: [
      {
        unique: true,
        fields: ["assignmentId", "studentId"],
      },
    ],
  },
)

module.exports = Submission
