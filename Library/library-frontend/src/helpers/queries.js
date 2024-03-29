import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
    query {
        bookCount
        authorCount
        allAuthors {
            name
            born
            bookCount
        }
    }
`;

export const ALL_BOOKS = gql`
    query {
        allBooks {
            author
            genres
            published
            title
        }
    }
`;

export const CREATE_BOOK = gql`
    mutation addBook(
        $author: String!
        $title: String!
        $published: Int!
        $genres: [String]
    ) {
        addBook(
            author: $author
            title: $title
            published: $published
            genres: $genres
        ) {
            author
            title
            published
            genres
        }
    }
`;

export const EDIT_YEAR_BORN = gql`
    mutation editAuthor($name: String!, $born: Int) {
        editAuthor(name: $name, born: $born) {
            name
            born            
        }
    }
`;
