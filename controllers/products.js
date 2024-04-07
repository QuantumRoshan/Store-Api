const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const product = await Product.find({})
  res.status(200).json({ product, nbHits: product.length })
}
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilers } = req.query
  const queryObject = {}
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }
  if (company) {
    queryObject.company = company
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }
  if (numericFilers) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }
    const regEx = /\b(<|>|>=|=|<|<=)\b/g
    let filters = numericFilers.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    )
    const options = ['price', 'rate']
    filters = filters.split(',').forEach((element) => {
      const [field, operator, value] = element.split('-')
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
        //{ field: { $gt: value } }
      }
    })
  }

  let result = Product.find(queryObject)

  if (sort) {
    const resultList = sort.split(',').join(' ')
    result = result.sort(resultList)
  } else {
    result = result.sort('createdAt')
  }
  if (fields) {
    const fieldList = fields.split(',').join(' ')
    result = result.select(fieldList)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)
  const product = await result
  res.status(200).json({ totalProducts: product.length, product })
}

getAllProducts,
  (module.exports = {
    getAllProductsStatic,
    getAllProducts,
  })
//4:34
