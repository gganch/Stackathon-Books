const axios = require('axios')
const Book = require('../db').models.book
const getSentimentFromText = require('./sentiment')

const fetchBookListsFromNYT = async () => {
  const { data } = await axios({
    method: 'get',
    url: 'https://api.nytimes.com/svc/books/v3/lists/overview.json',
    params: {
      'api-key': '77d24cf3145c4403b9bb17e414892841',
      'published_date': '2017-01-22'
    }
  })

  return data.results.lists
}

const filterNewBooks = async nytBooks => {
  // Gets all the books from the database
  const dbBooks = await Book.findAll()

  // Filter out books already in the database
  const dbIsbns = dbBooks.map(book => book.isbn13)
  const dbTitles = dbBooks.map(book => book.title)
  const dbDescriptions = dbBooks.map(book => book.description)

  let books = nytBooks
    .map(category => category.books)
    .reduce((acc, list) => [...acc, ...list], []);

  // Filter out duplicates title and descriptions
  const titles = []
  const descriptions = []
  books = books.filter(book => {
    const result = !(titles.includes(book.title) && descriptions.includes(book.desciption))
    titles.push(book.title)
    descriptions.push(book.desciption)
    return result
  });

  const newBooks = await books.filter(book => {
    // No desciption, skip that book
    if (!book.description) {
      return false
    }

    // Verify that the isbn 13
    if (!book.primary_isbn13) {
      return false
    }

    // Get the info
    const isbn13 = book.primary_isbn13
    const title = book.title
    const desciption = book.desciption

    // Check that the nyt book is not in the list of isbns from the database
    const isNewIsbn = !dbIsbns.includes(isbn13)
    const isNewTitle = !dbTitles.includes(title)
    const isNewDescription = !dbDescriptions.includes(desciption)

    return isNewIsbn && (isNewTitle || isNewDescription)
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
  const nytBookLists = await fetchBookListsFromNYT()

  // Filter them
  const newNytBooks = await filterNewBooks(nytBookLists)

  // Transorm into Book model
  const newBooks = newNytBooks.map(nytBook => {
    const { title, description, author, primary_isbn13: isbn13, book_image: image, amazon_product_url: amazonUrl } = nytBook
    return {
      title,
      description,
      author,
      isbn13,
      image,
      amazonUrl
    }
  })

  // Calculate the sentiment value for the books
  const processedBooks = await processBooks(newBooks)

  // Save the books in the database
  await Book.bulkCreate(processedBooks)
}

run()

module.exports = run
