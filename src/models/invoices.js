import mongoose from './../connection'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let invoices = new Schema({
  _id: { type: ObjectId },
  name: String,
  email: String,
  dateCreated: Date
})

let Invoices = mongoose.model('Invoices', invoices)

export default Invoices
