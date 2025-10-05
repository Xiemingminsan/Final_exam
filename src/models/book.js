const { sequelize, DataTypes } = require('../config/database')

const Book = sequelize.define('Book', {
  title: DataTypes.STRING,
  author: DataTypes.STRING,
  userId: DataTypes.INTEGER
})

module.exports = Book
