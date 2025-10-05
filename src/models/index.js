const { sequelize } = require('../config/database')
const User = require('./user')
const Book = require('./book')

User.hasMany(Book, { foreignKey: 'userId' })
Book.belongsTo(User, { foreignKey: 'userId' })

module.exports = { sequelize, User, Book }
