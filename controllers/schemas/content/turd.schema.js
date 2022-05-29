const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shortId = require('shortid')

const TurdSchema = Schema({
  turdId: {
    type: String,
    index: true,
    unique: true,
    default: shortId.generate
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  middle: {
    type: String
  },
  nickName: {
    type: String
  },
  group: {
    type: String
  },
  birthDate: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  party: {
    type: String,
    default: 'R'
  },
  state: {
    type: String
  },
  redFlag: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  id: false,
  collection: 'turds' 
})

TurdSchema.virtual('age').get( function() {
  let today = new Date().getFullYear()
  let birth = new Date(this.birthDate).getFullYear()
  return today - birth
})

class Turd {

  static async createTurd (turd) {
    try {
      let result = await this.create(turd)
      return result
    } catch (err) {
      return err
    }
  }

  static async bulkTurds (turds) {
    try {
      let result = await this.insertMany(turds)
      return result
    } catch (err) {
      return err
    }
  }

  static async getTurds () {
    try {
      let result = await this.find()
      return result
    } catch(err) {
      return err
    }
  }

  static async getTurd (turdId) {
    try {
      let result = await this.findOne({turdId})
      return result
    } catch(err) {
      return err
    }
  }

}

TurdSchema.loadClass(Turd)

module.exports = mongoose.model('TurdItem', TurdSchema)