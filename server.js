const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const paynimoRoutes = require('./routes/paynimoRoute')

const app = express()
const PORT = process.env.PORT || 3000
const ENV = process.env.NODE_ENV || "development";

app.use(helmet())

app.use(cors())
app.use(bodyParser.json({limit:'2mb'}))
app.use(bodyParser.urlencoded({extended:true,limit:'2mb'}))

app.use('/payment',paynimoRoutes)

app.listen(PORT,() => console.log(`Server is running on ${PORT} [${ENV}]`))
