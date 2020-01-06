const express = require('express')
const router = express.Router()
const db = require('../db')
const rand = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

router.get('/', async (req, res) => {
  const id = rand(1, 7000000)
  try {
    let product = await db.query(
      'SELECT * FROM products WHERE id=$1',
      [id]
    )
    product = product.rows[0]
    let reviews = await db.query(
      'SELECT * FROM reviews WHERE productId=$1',
      [product.id]
    )
    reviews = reviews.rows
    return res.status(200).send({product, reviews})
  } catch (e) {
    return res.status(400).send(e)
  }
})

router.get('/:id', async (req, res) => {
  try {
    let review = await db.query(
      'SELECT * FROM reviews WHERE id=$1',
      [req.params.id]
    )
    let product = await db.query(
      'SELECT * FROM products WHERE id=$1',
      [review.rows[0].productId]
    )
    review = review.rows[0]
    product = product.rows[0]
    return res.status(200).send({product, review})
  } catch (e) {
    return res.status(404).send(e)
  }
})

router.post('/', async (req, res) => {
  const productId = rand(1, 7000000)
  let {
    valueForMoney,
    productQuality,
    appearance,
    ease,
    worksAsExpected,
    username,
    date,
    title,
    text,
    notHelpful,
    helpful,
    recommend,
    stars
  } = req.body
  try {
    const confirmation = await db.query(
      `INSERT INTO reviews (
        valueForMoney,
        productQuality,
        appearance,
        ease,
        worksAsExpected,
        username,
        date,
        title,
        text,
        notHelpful,
        helpful,
        productId,
        recommend,
        stars
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);`,
      [
        valueForMoney,
        productQuality,
        appearance,
        ease,
        worksAsExpected,
        username,
        date,
        title,
        text,
        notHelpful,
        helpful,
        productId,
        recommend,
        stars
      ]
    )
    res.status(201).end()
  } catch (e) {
    console.error(e)
    return res.status(400).end(e)
  }
})
// router.put('/:id')
// router.delete('/:id')

module.exports = router
