import React, { useState, useEffect } from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, CREATE_BOOK, ALL_AUTHORS, CREATE_AUTHOR, FIND_AUTHOR, FIND_BOOK } from '../queries'


const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [error, setError] = useState('')
  const [getTitle, result] = useLazyQuery(FIND_BOOK)
  const [title2, setTitle2] = useState('')

  const [ addBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [  { query: ALL_BOOKS }, { query: ALL_AUTHORS } ],
    
    onError: (error) => {
      props.setErrorMessage(error.graphQLErrors[0])
    }
  })
  //console.log("Add book 1", title)
  
  if (!props.show) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const pub =  parseInt(published)
    //console.log('add book...')
    await addBook({ variables: { title, author, pub, genres } })
    //console.log("Add book 2 lisätty ", title)

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook