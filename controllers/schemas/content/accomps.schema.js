const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shortId = require('shortid')

const AccomplishmentSchema = Schema({
  accId: {
    type: String,
    index: true,
    unique: true,
    default: shortId.generate
  },
  ownerId: {
    type: String,
    index: true
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

  static async createItem (turd) {
    try {
      let result = await this.create(turd)
      return result
    } catch (err) {
      return err
    }
  }

  static async bulkItems (items) {
    try {
      let result = await this.insertMany(items)
      return result
    } catch (err) {
      return err
    }
  }

  static async getItems () {
    try {
      let count = await this.estimatedDocumentCount()
      let result = await this.find().sort({ lastName: 'asc' })
      return { result, count }
    } catch(err) {
      return err
    }
  }

  static async getItem (accId) {
    try {
      let result = await this.findOne({accId})
      return result
    } catch(err) {
      return err
    }
  }
}

AccomplishmentSchema.loadClass(Accomplishment)

module.exports = mongoose.model('AccomplishmentItem', AccomplishmentSchema)