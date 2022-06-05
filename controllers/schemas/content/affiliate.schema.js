const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shortId = require('shortid')

const AffiliateSchema = Schema({
  affId: {
    type: String,
    index: true,
    unique: true,
    default: shortId.generate
  },
  affiliate: {
    type: String,
    required: true
  }
},
{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  id: false,
  collection: 'affiliates' 
})

class Affiliate {
  static async createItem (data) {
    try {
      let result = await this.create(data)
      return result
    } catch (err) {
      return err
    }
  }

  static async getItems () {
    try {
      let count = await this.estimatedDocumentCount()
      let result = await this.find()
      return { result, count }
    } catch(err) {
      return err
    }
  }

  static async getItems(affId) {
    try {
      let result = await this.find({affId})
      return result
    } catch(err) {
      return err
    }
  }

}

AffiliateSchema.loadClass(Affiliate)

module.exports = mongoose.model('AffiliateItem', AffiliateSchema)