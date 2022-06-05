const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shortId = require('shortid')

const ReligionSchema = Schema({
  relId: {
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
  collection: 'religions' 
})

class Religion {

  static async createItem (acc) {
    try {
      let result = await this.create(acc)
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

  static async getItems (turdId) {
    try {
      let count = await this.estimatedDocumentCount()
      let result = await this.find({turdId}).sort({ lastName: 'asc' })
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

ReligionSchema.loadClass(Religion)

module.exports = mongoose.model('ReligionItem', ReligionSchema)