// Todo: queries.js: This will hold the query GET_ME, which will execute the me query set up using Apollo Server.

import { gql } from "@apollo/client";

export const GET_ME = gql`
{
    me {
        _id
        bookCount
        email
        savedBooks {
            authors
            bookId
            description
            image
            link
            title
        }
        username
        }
    }
`;