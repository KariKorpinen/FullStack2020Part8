import React from 'react'

import { useLazyQuery, useQuery } from '@apollo/client'

const Books = (props) => {

  if (!props.show) {
    return null
  }
  //console.log("Books books ", props.books)
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
         {props.books.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books