const start = Date.now()
const fs = require('fs')
const path = require('path')
const faker = require('faker')
const { Client } = require('pg')
const abPath1 = path.resolve('../service-blake/products.csv')
const abPath2 = path.resolve('../service-blake/reviews.csv')
const client = new Client({
  connectionString: 'postgresql://localhost/reviews-service'
})
client.connect()
async function createTables() {
  await client.query('DROP TABLE IF EXISTS products, reviews;')
  await client.query(
    `CREATE TABLE products(
      id SERIAL,
      identifier VARCHAR,
      description VARCHAR,
      length INTEGER,
      width INTEGER,
      height INTEGER,
      care VARCHAR,
      environment VARCHAR,
      materials VARCHAR,
      packages INTEGER,
      name VARCHAR,
      type VARCHAR
    );`
  )
  await client.query(
    `CREATE TABLE reviews(
      id SERIAL,
      valueForMoney INTEGER,
      productQuality INTEGER,
      appearance INTEGER,
      ease INTEGER,
      worksAsExpected INTEGER,
      username VARCHAR,
      date VARCHAR,
      title VARCHAR,
      text VARCHAR,
      notHelpful INTEGER,
      helpful INTEGER,
      productId INTEGER,
      recommend BOOLEAN,
      stars INTEGER
    );`
  )
}
createTables()

// helpers
const rand = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const description = (min, max) => {
  const sentences = rand(min, max)
  let description = ''
  for (let i = 0; i < sentences; i++) {
    description += faker.lorem.sentence()
  }
  return description
}

// generators
const generateProduct = id => {
  const data = {}
  data.id = id
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
  return data
}

const generateReview = id => {
  let data = {}
  data.id = id
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
  data.productId = rand(1, 6999999)
  data.recommend = faker.random.boolean()
  data.stars = rand(1, 5)
  return data
}

// writers
let writeProductStream = fs.createWriteStream('products.csv')
let writeReviewStream = fs.createWriteStream('reviews.csv')

const writeAll = (numRecords, writer, generator, callback) => {
  let i = numRecords
  let headerRow = numRecords - 1

  // CSV header
  const writeHead = data => {
    let header = ''
    for (var key in data) {
      header += `${key},`
    }
    header = header.slice(0, -1)
    writer.write(`${header}\n`)
  }

  // CSV row
  const writeRow = data => {
    let row = ''
    for (var key in data) {
      row += data[key] + ','
    }
    return row.slice(0, -1);
  }

  const write = () => {
    let ok = true
    let count = 1

    do {

      let data = generator(count)
      count++

      if (i > headerRow) {
        writeHead(data)
      }

      let row = writeRow(data)
      if (i === 1) {
        // Last time!
        writer.write(row)
        writer.end()
        callback()
      } else {
        // See if we should continue, or wait.
        // Don't pass the callback, because we're not done yet.

        ok = writer.write(`${row}\n`)
      }
      i--;
    } while (i > 0 && ok)

    if (i > 1) {
      // Had to stop early!
      // Write some more once it drains.
      writer.once('drain', write)
    }
  }
  write();
}

writeAll(7000000, writeProductStream, generateProduct, () => {
  writeAll(3000000, writeReviewStream, generateReview, () => {
    client.query(`COPY products FROM '${abPath1}' DELIMITER ',' CSV HEADER;`, (err, done) => {
      if (err) {
        return console.log(err)
      }
      client.query(`COPY reviews FROM '${abPath2}' DELIMITER ',' CSV HEADER;`, (err, done) => {
        if (err) {
          client.end()
          return console.log(err)
        }
        client.end()
        const milli = Date.now() - start
        return console.log(`Total time: ${Math.floor(milli/1000)} seconds`)
      })
    })
  })
})
