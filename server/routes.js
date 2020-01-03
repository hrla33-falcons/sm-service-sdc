const express = require('express')
const router = express.Router()
const db = require('../db')

// router.get('/', async (req, res) => {
//   try {
//     const results = await db.query('SELECT * FROM products')
//     return res.json(results)
//   } catch (e) {
//
//   }
// })
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM products WHERE id=$1",
      [req.params.id]
    )
    console.log('rows: ', rows)
    return res.status(200).json(rows[0])
  } catch (e) {
    return res.status(404).send(e)
  }
})
// router.post('/')
// router.put('/:id')
// router.delete('/:id')

module.exports = router
