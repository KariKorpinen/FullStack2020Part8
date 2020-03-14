import { gql  } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors  {

      name
      born
      bookCount
  
    }
  }
`
export const ALL_BOOKS = gql`
  query {
    allBooks  {

      title
      author
      published
    }
  }
`

export const FIND_AUTHOR = gql`
  query findAuthorByName($nameToSearch: String!) {
    findAuthor(name: $nameToSearch) {
      name
      born 
      id
      bookCount
    }
  }
`
export const FIND_BOOK = gql`
  query findABookByTitle($titleToSearch: String!) {
    findTitle(title: $titleToSearch) {
      title
      author 
    }
  }
`

export const CREATE_AUTHOR = gql`
  mutation createAuthor($name: String!, $born: Int, $bookCount: Int) {
    addAuthor(
      name: $name,
      born: $born,
      bookCount: $bookCount
    ) {
      name
      born
      id
      bookCount
    }
  }
`
export const CREATE_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int, $genres: [String]) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author
      id
      published
      genres
      }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`

 export const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $setBornTo: Int!) {
    editNumber(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`