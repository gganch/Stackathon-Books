const router = require('express').Router()
// import axios} from 'axios'
const axios = require('axios')
const Book = require('../db/models/book')

router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll()
    res.send(books)
  } catch (err) {
    next(err)
  }
})

module.exports = router
