require('dotenv').config()
const connectDb = require('./db/connect')
const product = require('./models/product')
const jsonData = require('./products.json')
const start = async () => {
  try {
    await connectDb(process.env.Mongo_db)
    await product.deleteMany()
    await product.create(jsonData)
    console.log('Success')
  } catch (error) {
    console.log(error)
  }
}
start()
