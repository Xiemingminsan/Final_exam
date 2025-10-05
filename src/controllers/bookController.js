const Book = require('../models/book')

const cacheStore = new Map()

function cacheKeyFor(page, limit) {
  return `books:${page}:${limit}`
}

function readCache(key) {
  const entry = cacheStore.get(key)
  if (!entry) return null
  if (entry.expiresAt <= Date.now()) {
    cacheStore.delete(key)
    return null
  }
  return entry.value
}

function writeCache(key, value, ttlSeconds) {
  cacheStore.set(key, { value: JSON.parse(JSON.stringify(value)), expiresAt: Date.now() + ttlSeconds * 1000 })
}

function clearCache() {
  cacheStore.clear()
}

async function listBooks(req, res) {
  const page = Math.max(1, parseInt(req.query.page || '1', 10))
  const limit = Math.max(1, parseInt(req.query.limit || '10', 10))
  const offset = (page - 1) * limit
  const key = cacheKeyFor(page, limit)
  const cached = readCache(key)
  if (cached) {
    res.json(cached)
    return
  }
  const total = await Book.count()
  const books = await Book.findAll({ limit, offset, attributes: ['id', 'title'] })
  const payload = {
    data: books,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1
    }
  }
  writeCache(key, payload, 30)
  res.json(payload)
}

async function createBook(req, res) {
  const { title, author } = req.body
  const book = await Book.create({ title, author, userId: req.user.id })
  clearCache()
  res.status(201).json(book)
}

async function updateBook(req, res) {
  const { id } = req.params
  const book = await Book.findByPk(id)
  if (!book) {
    res.status(404).json({ message: 'Book not found' })
    return
  }
  if (book.userId !== req.user.id) {
    res.status(403).json({ message: 'Forbidden' })
    return
  }
  const updates = {}
  if (req.body.title !== undefined) updates.title = req.body.title
  if (req.body.author !== undefined) updates.author = req.body.author
  await Book.update(updates, { where: { id: book.id } })
  const updated = await Book.findByPk(book.id)
  clearCache()
  res.json(updated)
}

async function deleteBook(req, res) {
  const { id } = req.params
  const book = await Book.findByPk(id)
  if (!book) {
    res.status(404).json({ message: 'Book not found' })
    return
  }
  if (book.userId !== req.user.id) {
    res.status(403).json({ message: 'Forbidden' })
    return
  }
  await Book.destroy({ where: { id: book.id } })
  clearCache()
  res.status(204).send('')
}

module.exports = { listBooks, createBook, updateBook, deleteBook }
