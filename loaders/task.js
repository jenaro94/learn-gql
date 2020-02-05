const Task = require('../database/models/task')

module.exports.batchTasks = async taskIds => {
  let tasksForEachUser = []
  for (let i = 0; i < taskIds.length; i++) {
    const tasks = await Task.find({ _id: { $in: taskIds[i] } })
    tasksForEachUser.push(tasks)
  }

  return tasksForEachUser
}
