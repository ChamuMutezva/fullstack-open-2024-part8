const { ApolloServer } = require("@apollo/server");
const { GraphQLError } = require("graphql");
const gql = require("graphql-tag");
const { v1: uuid } = require("uuid");
const { startStandaloneServer } = require("@apollo/server/standalone");

let authors = [
    {
        name: "Robert Martin",
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: "Martin Fowler",
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963,
    },
    {
        name: "Fyodor Dostoevsky",
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821,
    },
    {
        name: "Joshua Kerievsky", // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: "Sandi Metz", // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
];

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */

let books = [
    {
        title: "Clean Code",
        published: 2008,
        author: "Robert Martin",
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring"],
    },
    {
        title: "Agile software development",
        published: 2002,
        author: "Robert Martin",
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ["agile", "patterns", "design"],
    },
    {
        title: "Refactoring, edition 2",
        published: 2018,
        author: "Martin Fowler",
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring"],
    },
    {
        title: "Refactoring to patterns",
        published: 2008,
        author: "Joshua Kerievsky",
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring", "patterns"],
    },
    {
        title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
        published: 2012,
        author: "Sandi Metz",
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring", "design"],
    },
    {
        title: "Crime and punishment",
        published: 1866,
        author: "Fyodor Dostoevsky",
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ["classic", "crime"],
    },
    {
        title: "The Demon ",
        published: 1872,
        author: "Fyodor Dostoevsky",
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ["classic", "revolution"],
    },
];

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = gql`
    "Book details"
    type Book {
        title: String!
        author: String!
        published: Int!
        genres: [String!]
    }

    "Author details => name of author, year born and number of written books"
    type Author {
        name: String!
        born: Int
        bookCount: Int!
    }

    type Query {
        "total number of books in the book array"
        bookCount: Int!
        "total nymber of authors in the authors array"
        authorCount: Int!
        "list of all books"
        allBooks(author: String, genre: String): [Book!]!
        "list of all authors"
        allAuthors: [Author!]!
    }

    "add a new book mutation"
    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String]
        ): Book
        editAuthor(name: String!, born: Int): Author
    }
`;

const resolvers = {
    Mutation: {
        addBook: (root, args) => {
            if (books.find((book) => book.title === args.title)) {
                throw new GraphQLError("Title must be unique", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.title,
                    },
                });
            }
            const existingAuthor = authors.find(author => author.name === args.author)
           console.log(existingAuthor)          
            const book = { ...args, id: uuid() };
            books = books.concat(book);
            if (!existingAuthor) {
                authors = authors.concat({name: args.author, id: book.id})
            }
            return book;
        },

        editAuthor: (root, args) => {
            const author = authors.find((aut) => aut.name === args.name);
            if (!author) {
                return null;
            }

            const updatedAuthor = { ...author, born: args.born };
            authors = authors.map((aut) =>
                aut.name === args.name ? updatedAuthor : aut
            );
            return updatedAuthor;
        },
    },
    Query: {
        // find the length of the the books array to get the total number of books
        bookCount: () => books.length,
        // find the length of the authors array to get the total number of authors
        authorCount: () => authors.length,
        // get(query) all books
        allBooks: (_, { author, genre }) => {
            if (author && genre) {
                return books
                    .filter((book) => book.author === author)
                    .filter((book) => book.genres.includes(genre));
            }
            if (author) {
                return books.filter((book) => book.author === author);
            }
            if (genre) {
                return books.filter((book) => book.genres.includes(genre));
            }
            return books;
        },
        // get all authors and number of books written by the author
        allAuthors: () => {
            return authors.map((author) => ({
                name: author.name,
                born: author.born,
                bookCount: books.filter((book) => book.author === author.name)
                    .length,
            }));
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
