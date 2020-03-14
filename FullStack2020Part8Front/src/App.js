
import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, CREATE_AUTHOR } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [boo, setBook] = useState('books')
  const [newBook, setNewBook] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_AUTHORS)
  const resultAuthors = result
  const result2 = useQuery(ALL_BOOKS)
  const resultBooks = result2
  
  if (result.loading)  {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
 
      <Notify errorMessage={errorMessage} />
      
      <Authors
        show={page === 'authors'}
        authors={resultAuthors}
        page={page} setPage={setPage}
       
      />

      <Books
        show={page === 'books'}
        books={resultBooks}
       />

      <NewBook
        show={page === 'add'}
        authors={resultAuthors} setError={notify}
        errorMessage={errorMessage} setErrorMessage={setErrorMessage}
        page={page} setPage={setPage}
      />

    </div>
  )
}

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null  
  }  
  return (
    <div style={{color: 'red'}}>
      {errorMessage}    
    </div>  
  )
}

export default App