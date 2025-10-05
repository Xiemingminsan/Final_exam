const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({ dialect: 'postgres', storage: path.join(process.cwd(), 'data', 'database.json') })

module.exports = { sequelize, DataTypes }
