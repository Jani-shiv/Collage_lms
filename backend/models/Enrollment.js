const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Enrollment = sequelize.define(
  "Enrollment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "courses",
        key: "id",
      },
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F", "I", "W"]],
      },
    },
    status: {
      type: DataTypes.ENUM("enrolled", "completed", "dropped"),
      defaultValue: "enrolled",
    },
  },
  {
    tableName: "enrollments",
    indexes: [
      {
        unique: true,
        fields: ["studentId", "courseId"],
      },
    ],
  },
)

module.exports = Enrollment
