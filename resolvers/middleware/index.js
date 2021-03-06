const { skip } = require('graphql-resolvers')

const Task = require('../../database/models/task')
const { isValidObjectId } = require('../../database/util/index')

module.exports.isAuthenticated = (_, __, { email }) => {
  if (!email) {
    throw new Error('Access Denied! Please login to continue.')
  }
  return skip
}

module.exports.isTaskOwner = async (_, { id }, { loggedInUserId }) => {
  if (!isValidObjectId(id)) {
    throw new Error('ID provided is invalid!')
  }
  const task = await Task.findById(id)
  if (!task) {
    throw new Error('Task not found!')
  } else if (task.user.toString() !== loggedInUserId) {
    throw new Error('You are not the owner of this task!')
  }

  return skip
}
