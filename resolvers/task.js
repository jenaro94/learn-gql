const { combineResolvers } = require('graphql-resolvers')

const Task = require('../database/models/task')
const User = require('../database/models/user')
const { isAuthenticated, isTaskOwner } = require('./middleware')

module.exports = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (_, __, { loggedInUserId }) =>
        await Task.find({ user: loggedInUserId })
    ),
    task: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_, { id }) => await Task.findById(id)
    ),
  },
  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { email }) => {
        const user = await User.findOne({ email })
        const task = new Task({
          ...input,
          user: user.id,
        })
        const result = await task.save()
        user.tasks.push(result.id)
        await user.save()
        return result
      }
    ),
  },
  Task: {
    user: async parent => await User.findById(parent.user),
  },
}
