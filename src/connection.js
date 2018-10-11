import secrets from './secrets'
import mongoose from 'mongoose'

mongoose.connect(
  secrets.db_host,
  { useNewUrlParser: true }
)

// Get Mongoose to use the global promise library
mongoose.Promise = Promise

// Get the default connection
var db = mongoose.connection

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

db.once('open', function () {
  console.log('Connection ok!')
})

// module.exports = mongoose
export default mongoose
