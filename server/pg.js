const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const routes = require('./routes')
const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/../client/dist'))
app.use('/reviews', routes)

app.use((req, res) => {
  let err = new Error('Not found')
  res.status(404).send(err)
})

app.listen(3003, () => console.log('app listening on port 3003'))
