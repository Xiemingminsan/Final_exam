const dotenv = require('dotenv')
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const { sequelize } = require('./models')

dotenv.config()

const app = express()

app.use(express.json())

authRoutes(app)
bookRoutes(app)

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal server error' })
})

async function initDatabase() {
  await sequelize.sync()
}

module.exports = { app, initDatabase }
