const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shortId = require('shortid')

const BlogSchema = Schema({
  blogId: {
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
  collection: 'blogs' 
})

class Blog {
  
}

BlogSchema.loadClass(Blog)

module.exports = mongoose.model('BlogItem', BlogSchema)