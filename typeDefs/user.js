const { gql } = require('apollo-server-express')

module.exports = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
  }

  input SignupInput {
    email: String!
    name: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Token {
    token: String!
  }

  extend type Mutation {
    signup(input: SignupInput): User
    login(input: LoginInput): Token
  }

  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
    createdAt: Date!
    updatedAt: Date!
  }
`
