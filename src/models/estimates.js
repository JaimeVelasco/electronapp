import mongoose from './../connection'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let estimates = new Schema({
  _id: { type: ObjectId },
  company: { type: ObjectId },
  dateCreated: Date
})

let Estimates = mongoose.model('estimates', estimates)

export default Estimates
