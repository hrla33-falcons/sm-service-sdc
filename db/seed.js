const mongoose = require('mongoose')
const faker = require('faker')
const Product = require('./models/Product')
const Review = require('./models/Review')

mongoose.connect('mongodb://localhost/fec', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const products = []

for (i = 0; i < 100; i++) {
  const data = {}
  data.id = i + 1
  data.identifier = `${rand(1, 999)}.${rand(1, 999)}.${rand(1, 999)}`
  data.description = description(5, 8)
  data.length = rand(1, 99)
  data.width = rand(1, 99)
  data.height = rand(1, 99)
  data.care = description(1, 4)
  data.environment = description(1, 4)
  data.materials = faker.lorem.sentence()
  data.packages = 1
  data.name = faker.lorem.word()
  data.type = faker.lorem.word()
  data.type = data.type.charAt(0).toUpperCase() + data.type.slice(1)
  products.push(data)
}

const reviews = []

for (i = 0; i < 300; i++) {
  const data = {}
  data.id = i + 1
  data.valueForMoney = rand(1, 5)
  data.productQuality = rand(1, 5)
  data.appearance = rand(1, 5)
  data.ease = rand(1, 5)
  data.worksAsExpected = rand(1, 5)
  data.username = faker.internet.userName()
  data.date = faker.date.past()
  let title = faker.lorem.words()
  data.title = title.charAt(0).toUpperCase() + title.slice(1)
  data.text = faker.lorem.sentences()
  data.notHelpful = rand(1, 10)
  data.helpful = rand(1, 20)
  data.productId = rand(1, 100)
  data.recommend = faker.random.boolean()
  data.stars = rand(1, 5)
  reviews.push(data)
}

Product.deleteMany(err => {
  if (err) console.error(err)
  else {
    console.log('removed products')
    Product.collection.insertMany(products, (err, data) => {
      if (err) console.error(err)
      else {
        console.log('generated products')
        Review.deleteMany(err => {
          if (err) console.error(err)
          else {
            console.log('removed reviews')
            Review.collection.insertMany(reviews, (err, data) => {
              if (err) console.error(err)
              else console.log('generated reviews')
              mongoose.connection.close()
            })
          }
        })
      }
    })
  }
})

function description(min, max) {
  const sentences = rand(min, max)
  let description = ''
  for (let i = 0; i < sentences; i++) {
    if (i > 0) description += '\n\n'
    description += faker.lorem.sentence()
  }
  return description
}

function rand(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
