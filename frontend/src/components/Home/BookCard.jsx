  import React from 'react'
  import BookSingleCard from './BookSingleCard';

  const BookCard = ({books,cart,setCart}) => {
    return (
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {
          books.map((book,index) => {
            return(
              <BookSingleCard key={book.id || index} book={book} cart={cart} setCart={setCart}/>
            )
            
          })
        }
      </div>
    )
  }

export default BookCard;
