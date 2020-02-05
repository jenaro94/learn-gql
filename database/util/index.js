const mongoose = require('mongoose')

module.exports.connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    console.log('🤲 Database connected successfully')
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports.isValidObjectId = id => {
  return mongoose.Types.ObjectId.isValid(id)
}
