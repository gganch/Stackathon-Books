const axios = require('axios')
const Book = require('../db').models.book
const getSentimentFromText = require('./sentiment')

const fetchBooksFromNYT = async () => {
  const {data} = await axios({
    method: 'get',
    url: 'https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json',
    params: {
      'api-key': '77d24cf3145c4403b9bb17e414892841'
    }
  })

  return data.results
}

const filterNewBooks = async nytBooks => {
  // Gets all the books from the database
  const dbBooks = await Book.findAll()

  // Filter out books already in the database
  const dbIsbns = dbBooks.map(book => book.isbn13)
  const newBooks = nytBooks.filter(book => {
    // No desciption, skip that book
    if (!book.description) {
      return false
    }

    // Verify that the isbn 13
    if (!book.isbns || book.isbns.length === 0) {
      return false
    }
    // Get the isbn13
    const isbn13 = book.isbns[0].isbn13

    // Check that the nyt book is not in the list of isbns from the database
    return dbIsbns.includes(isbn13) === false
  })

  return newBooks
}

const getSentimentForBook = async book => {
  const sentiment = await getSentimentFromText(book.description)
  return sentiment.score
}

const processBooks = books => {
  return Promise.all(
    books.map(async book => {
      book.sentiment = await getSentimentForBook(book)
      return book
    })
  )
}

const run = async () => {
  // Fetch books
  const nytBooks = await fetchBooksFromNYT()

  // Filter them
  const newNytBooks = await filterNewBooks(nytBooks)

  // Transorm into Book model
  const newBooks = newNytBooks.map(nytBook => {
    const {title, description, author} = nytBook
    const isbn13 = nytBook.isbns[0].isbn13
    return {
      title,
      description,
      author,
      isbn13
    }
  })

  // Calculate the sentiment value for the books
  const processedBooks = await processBooks(newBooks)

  // Save the books in the database
  await Book.bulkCreate(processedBooks)
}

module.exports = run
