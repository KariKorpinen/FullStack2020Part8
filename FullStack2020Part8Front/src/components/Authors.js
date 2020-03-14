  
import React, { useState, useEffect } from 'react'

import { useLazyQuery, useQuery } from '@apollo/client'
import BornForm from './BornForm'
import { ALL_AUTHORS } from '../queries'

const Authors = (props) => {
  //console.log("Author author ", props.authors)
  const authors = props.authors
 
  if (!props.show) {
    return null
  }
  if (authors.loading)
    return (<div>loading ...</div>)
  //console.log("authors ", authors)
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.map(a =>
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <BornForm authors={props.authors} page={props.page} setPage={props.setPage} />
    </div>
  )
}

export default Authors