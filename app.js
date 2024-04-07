require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const connectDb = require('./db/connect')
const products = require('./routes/products')

const middlwearNotfound = require('./middleware/not-found')
const middlwearErrorHandeller = require('./middleware/error-handler')

const port = process.env.PORT || 3000

//Middleware
app.use(express.json())

//Routes
app.get('/', (req, res) => {
  res
    .status(200)
    .send('<h1><a href="api/v1/products">Move to products<?a></h1>')
})
app.use('/api/v1/products', products)

app.use(middlwearNotfound)
app.use(middlwearErrorHandeller)

const start = async () => {
  try {
    await connectDb(process.env.Mongo_db)
    app.listen(port, () => console.log(`Server is listening at port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
