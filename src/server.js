const { app, initDatabase } = require('./app')

const PORT = process.env.PORT || 3000

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      process.stdout.write(`Server running on port ${PORT}\n`)
    })
  })
  .catch(error => {
    process.stderr.write(`Failed to start server: ${error.message}\n`)
    process.exit(1)
  })
