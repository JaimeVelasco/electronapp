import mongoose from './../connection'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let client = new Schema({
  _id: { type: ObjectId },
  name: String,
  email: String,
  dateCreated: Date
})

let Clients = mongoose.model('Clients', client)

export default Clients
