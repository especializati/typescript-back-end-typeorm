import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import './connection'
import productController from './controllers/product.controller'


const PORT = process.env.PORT || 8080

const app = express()
app.post('/api/products', productController.create)
app.get('/api/products', productController.findAll)
app.get('/', (request, response) => {
  response.send("Server up 2")
})
app.listen(PORT, () => {
  console.log(`server running in port  ${PORT}`)
})
