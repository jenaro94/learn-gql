const { gql } = require('apollo-server-express')

module.exports = gql`
  type PageInfo {
    nextPageCursor: String
    hasNextPage: Boolean
  }

  type TaskFeed {
    taskFeed: [Task!]
    pageInfo: PageInfo!
  }

  extend type Query {
    tasks(cursor: String, limit: Int): TaskFeed!
    task(id: ID!): Task
  }

  input CreateTaskInput {
    name: String!
    completed: Boolean!
  }

  input UpdateTaskInput {
    name: String
    completed: Boolean
  }

  extend type Mutation {
    createTask(input: CreateTaskInput!): Task
    updateTask(id: ID!, input: UpdateTaskInput!): Task
    deleteTask(id: ID!): Task
  }

  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User
    createdAt: Date!
    updatedAt: Date!
  }
`
