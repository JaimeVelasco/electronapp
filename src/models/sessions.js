import mongoose from './../connection'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let sessions = new Schema({
  _id: { type: ObjectId },
  name: String,
  email: String,
  dateCreated: Date
})

let Sessions = mongoose.model('Sessions', sessions)

export default Sessions
