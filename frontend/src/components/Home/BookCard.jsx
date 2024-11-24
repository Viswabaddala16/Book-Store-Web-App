  import React from 'react'
  import BookSingleCard from './BookSingleCard';

  const BookCard = ({books}) => {
    return (
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {
          books.map((book,index) => {
            return(
              <BookSingleCard key={book.id || index} book={book}/>
            )
            
          })
        }
      </div>
    )
  }

  export default BookCard;
