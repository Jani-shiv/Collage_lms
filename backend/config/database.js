const { Sequelize } = require("sequelize")
require("dotenv").config()

// Database configuration
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_PATH || "./database/college_lms.sqlite",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: false,
  },
})

module.exports = sequelize
