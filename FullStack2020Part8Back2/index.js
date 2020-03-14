const { ApolloServer, UserInputError, gql } = require('apollo-server')

const uuid = require('uuid/v1')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const config = require('./utils/config')

mongoose.set('useFindAndModify', false)

const MONGODB_URI = config.MONGODB_URI

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

mongoose.set('useCreateIndex', true)

//console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

  let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
  type Author {
    name: String!
    born: Int
    bookCount: Int
    books: [Book!]!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Query {
    authorCount: Int!
    allAuthors: [Author!]!
    findAuthor(name: String!): Author

    bookCount: Int!
    allBooks(genre: String, author: String): [Book!]!
    findBook(title: String!): Book
  }

  type Mutation {
    addBook(
      title: String!
      published: Int
      author: String!
      genres: [String]
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int
    ): Author
  }  
`

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments() ,
    allAuthors: async () => {
      const aut = await Author.find({}).populate('books')
      aut.map(async a => {
      let bookCount = await Book.find({ author: author.id}).countDocuments()
      a.bookCount=bookCount.length
      })
      return aut
    },
    findAuthor: async () => {
      const aunt = await Author.findById(author.name)
    },
    bookCount: () => Book.collection.countDocuments(),
    
    allBooks: async (root, args) => {
     
      let booksreturn = await Book.find({})

      if(!args.genre && !args.author){
        //console.log("ei author ja ei genre")

        return booksreturn.map(async b => {
          return {
          title: b.title,
          author: await Author.findById(b.author),
          published: b.published,
          genres: b.genres
          }
        })
      }
      
      else if(!args.genre && args.author){
        console.log("author ja ei genre")
        return booksreturn.filter(p => p.author.includes(args.author))
      }
      else if(args.genre && !args.author){
         console.log("ei author ja genre")
         return booksreturn.filter(p => p.genres.includes(args.genre))
      }
      else if (args.genre && args.author){
        console.log("author ja genre")
        const argsauthor = await Author.findOne({name: args.author })
          booksreturn = booksreturn.filter(b =>{
          return b.author.equals(argsauthor.id)
        }) 
      }
    },
    findBook: async () => {
    const boo = await Book.findById( book.title)
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      console.log("args ", args)
      if (books.find(p => p.title === args.title)) {
        throw new UserInputError('Title must be unique', {
          invalidArgs: args.title,
        })
        return
      }
      const book = { ...args, id: uuid() }
      
      let findAuthor = await Author.findOne({ name: args.author})
      //  console.log("authors non exist ")
      if(!findAuthor) {
        findAuthor = await new Author({name: args.author})
        await findAuthor.save()  
          .catch(err => {
            throw new UserInputError("Author exists or name too short", {invalidArgs: args,})
          })
      }
      const newBook = new Book({ ...args, findAuthor })
         await newBook.save()
      },
    
    editAuthor: async (root, args) => {
      let findAuthor = await Author.findOne({ name: args.name})
      if (!author) {
        return null
      }
      findAuthor.born = args.setBornTo
      await findAuthor.save()
      return findAuthor
    }       
  }  
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})