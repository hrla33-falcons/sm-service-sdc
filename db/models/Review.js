const mongoose = require('mongoose')
const faker = require('faker')

const schema = new mongoose.Schema({
  id: {
    type: Number,
    index: true
  },
  valueForMoney: Number,
  productQuality: Number,
  Appearance: Number,
  easeOfAssembly: Number,
  worksAsExpected: Number,
  username: String,
  date: Date,
  title: String,
  text: String,
  notHelpful: Number,
  helpful: Number,
  productId: {
    type: Number,
    index: true
  },
  recommend: Boolean
})

const Review = mongoose.model('Review', schema)

module.exports = Review
