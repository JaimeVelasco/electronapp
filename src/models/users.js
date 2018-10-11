import mongoose from './../connection'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

var user = new Schema({
  _id: { type: ObjectId },
  name: String,
  email: String,
  dateCreated: Date,
  password: String
})

let Users = mongoose.model('Users', user)

export default Users
