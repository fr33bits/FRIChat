const express = require('express')
const cors = require('cors') // cross-origin requests
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 4000

const authRoutes = require('./routes/auth.js')

app.use(cors())
app.use(express.json()) // allows for passing JSON from the front-end to the back-end
app.use(express.urlencoded())

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.use('/auth', authRoutes)

app.listen(PORT, () => console.log(`Strežnik se je zagnal na vratih ${PORT}`))