import React from 'react'

const sadBooks = props => {
  const { books } = props;
  console.log(books)
  return (
    <div className='row'>
      {books
        .filter(book => book.sentiment < 0).sort((item1, item2) => item1.sentiment - item2.sentiment)
        .map(book =>
          <div className='col s6 m4 l3' key={book.id}>
            <div className="card">
              <div className="card-image">
                <img className='book-cover' src={book.image} />
              </div>
              <div className="card-content">
                <p>{book.description}</p>
              </div>
              <div className="card-action">
                <a href={book.amazonUrl}>Buy This Book</a>
              </div>
            </div>

          </div>
        )}
    </div>
  );
};

module.exports = sadBooks;
