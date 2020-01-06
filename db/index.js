const { Pool } = require('pg')
const pool = new Pool({
  connectionString: 'postgresql://localhost/reviews-service'
})

module.exports = pool
