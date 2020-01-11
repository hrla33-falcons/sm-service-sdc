const mongoose = require('mongoose')
const Product = require('./models/Product')
const Review = require('./models/Review')
const faker = require('faker')
mongoose.connect('mongodb://54.183.230.20/reviews-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  // user: 'stevejrmc',
  // pass: 'admin'
})
// ?authSource=admin
function rand(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  getOne: function(req, res) {
    const id = req.params.id;
    Review.findOne({ id }, (err, review) => {
      if (err) {
        res.status(404).send(err)
      }
      Product.findOne({ id: review.productId }, (err, product) => {
        if (err) {
          res.status(404).send(err)
        }
        res.status(200).send({product, review})
      })
    })
  },
  get: function(req, res) {
    const id = rand(1, 7000000)
    Product.findOne({ id }, (err, product) => {
      if (err) {
        res.status(404).send(err)
      }
      Review.find({ productId: product.id }, (err, reviews) => {
        if (err) {
          res.status(404).send(err)
        }
        res.status(200).send({product, reviews})
      })
    })
  },
  post: function(req, res) {
    const productId = rand(1, 7000000)
    let review = req.body
    review.productId = productId
    Review.estimatedDocumentCount()
      .then(count => {
        review.id = count + 1
        Review.create(review)
          .then(created => res.status(201).send(created))
          .catch(err => res.status(404).send(err))
      })
      .catch(err => res.status(404).send(err))
  },
  put: function(req, res) {
    const id = req.params.id
    Review.findOneAndUpdate({ id }, req.body, (err, confirm) => {
      if (err) {
        res.status(404).send(err)
      }
      res.status(200).send(confirm)
    })
  },
  delete: function(req, res) {
    const id = req.params.id
    Review.deleteOne({id}, (err, confirm) => {
      if (err) {
        res.status(404).send(err)
      }
      res.status(202).send(confirm)
    })
  }
}
