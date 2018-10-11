import mongoose from './../connection'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

var company = new Schema({
  _id: { type: ObjectId },
  name: String,
  email: String,
  dateCreated: Date,
  stripe: Object
})

let Companies = mongoose.model('Companies', company)

export default Companies
