const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')
const dotEnv = require('dotenv')
const Dataloader = require('dataloader')

const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')
const { connection } = require('./database/util')
const { verifyUser } = require('./helper/context')
const loaders = require('./loaders')

dotEnv.config()

const app = express()

connection()

app.use(cors())

app.use(express.json())

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    await verifyUser(req)
    return {
      email: req.email,
      loggedInUserId: req.loggedInUserId,
      loaders: {
        user: new Dataloader(keys => loaders.user.batchUsers(keys)),
      },
    }
  },
})

apolloServer.applyMiddleware({ app, path: '/graphql' })

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 App running on port: ${PORT}`)
  console.log(`GraphQL endpoint: ${apolloServer.graphqlPath}`)
})
