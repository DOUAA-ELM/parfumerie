import express from 'express'
import data from './data.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import seedRouter from './routes/seedRoutes.js'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/userRoutes.js'
import { keycloak } from './middlewares/keycloak.js'
dotenv.config()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db', process.env.MONGODB_URI)
  })
  .catch((err) => {
    console.log(err.message)
  })

const app = express()
import cors from 'cors'

app.use(cors())
app.use(keycloak.middleware())
app.use(express.json()) // analyser les corps des requêtes qui contiennent des données JSON.
app.use(express.urlencoded({ extended: true })) // analyser les corps des requêtes contenant des données URL-encodées,

app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`)
})
