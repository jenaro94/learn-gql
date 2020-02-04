const uuid = require('uuid')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { users, tasks } = require('../constants')
const User = require('../database/models/user')

module.exports = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id),
  },
  Mutation: {
    signup: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email })
        if (user) {
          throw new Error('Email already in use')
        }

        const hashedPassword = await bcrypt.hash(input.password, 12)
        const newUser = new User({ ...input, password: hashedPassword })
        const result = newUser.save()
        return result
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email })
        if (!user) {
          throw new Error('User not found')
        }

        const isPasswordValid = await bcrypt.compare(
          input.password,
          user.password
        )
        if (!isPasswordValid) {
          throw new Error('Password incorrect.')
        }

        const secret = process.env.JWT_SECRET_KEY || 'mysecretkey'
        const token = jwt.sign({ email: user.email }, secret, {
          expiresIn: '1d',
        })
        return { token }
      } catch (err) {
        console.log(err)
        throw err
      }
    },
  },
  User: {
    tasks: ({ id }) => tasks.filter(task => task.userId === id),
  },
}
