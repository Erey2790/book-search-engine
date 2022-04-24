// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create  our typeDefs
const typeDefs = gql`
type Query {
    me: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SavedBookInput): User
    removeBook(bookId: String!): User
}

type User {
    _id: ID
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
}
`;

// export the typeDefs
module.exports = typeDefs;