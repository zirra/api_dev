const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shortId = require('shortid')

const AccomplishmentSchema = Schema({
  accId: {
    type: String,
    index: true,
    unique: true,
    default: shortId.generate
  }
},
{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  id: false,
  collection: 'accomplishments' 
})

class Accomplishment {
  
}

AccomplishmentSchema.loadClass(Accomplishment)

module.exports = mongoose.model('AccomplishmentItem', AccomplishmentSchema)