const { combineResolvers } = require('graphql-resolvers')

const Task = require('../database/models/task')
const User = require('../database/models/user')
const { isAuthenticated, isTaskOwner } = require('./middleware')
const { stringToBase64, base64ToString } = require('../helper')

module.exports = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (_, { cursor, limit = 10 }, { loggedInUserId }) => {
        const query = { user: loggedInUserId }
        if (cursor) {
          query['_id'] = {
            $lt: base64ToString(cursor),
          }
        }
        let tasks = await Task.find(query)
          .sort({ _id: -1 })
          .limit(limit + 1)

        const hasNextPage = tasks.length > limit
        tasks = hasNextPage ? tasks.slice(0, -1) : tasks

        return {
          taskFeed: tasks,
          pageInfo: {
            nextPageCursor: hasNextPage
              ? stringToBase64(tasks[tasks.length - 1].id)
              : null,
            hasNextPage,
          },
        }
      }
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
    updateTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_, { id, input }) => {
        const task = Task.findByIdAndUpdate(id, { ...input }, { new: true })
        return task
      }
    ),
    deleteTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_, { id }, { loggedInUserId }) => {
        const task = await Task.findByIdAndDelete(id)
        await User.updateOne(
          { _id: loggedInUserId },
          { $pull: { tasks: task.id } }
        )
        return task
      }
    ),
  },
  Task: {
    user: async (parent, _, { loaders }) => await loaders.user.load(parent.user.toString()),
  },
}
