import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, EDIT_NUMBER, ALL_AUTHORS } from '../queries'

const BornForm = (props) => {
  const defaultName = props.authors.data.allAuthors[0].name
  const [name, setName] = useState(defaultName)
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],

    onError: props.setError,
    onCompleted: () => {
      props.setPage('authors')
    }
  })

 const submit = async (event) => {
    event.preventDefault()

    editAuthor({ variables: { name, setBornTo: parseInt(born) } })

    setName(defaultName)
    setBorn('')
  }
  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <div>
         
          <select onChange={({ target }) => setName(target.value)}>
            {
              props.authors.data.allAuthors.map(author => {
                return (
                  <option key={author.id} value={author.name}>{author.name}</option>
                )
              })
            }
          </select>
        </div>
        <div>
          born 
          <input name="born" value={born} type="number" onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default BornForm