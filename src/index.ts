import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8080

const app = express()
app.get('/', (request, response) => {
  response.send("Server up 2")
})
app.listen(PORT, () => {
  console.log(`server running in port  ${PORT}`)
})
