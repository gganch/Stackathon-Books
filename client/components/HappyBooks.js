import React from 'react'

const HappyBooks = props => {
  const { books } = props;
  console.log(books)
  return (
    <div className='row'>
      {books
        .filter(book => book.sentiment >= 0.4).sort((item1, item2) => item2.sentiment - item1.sentiment)
        .map(book =>
          <div className='col s6 m4 l3' key={book.id}>
            {/* <h4>{book.title}</h4>
            <p>{book.description}</p> */}
            <div className="card">
              <div className="card-image">
                <img className='book-cover' src={book.image} />
                {/* <span className="card-title">{book.title}</span> */}
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

module.exports = HappyBooks;
