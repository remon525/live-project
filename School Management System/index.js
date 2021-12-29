require('dotenv').config()

const express = require('express')
const app = express()
const Server = require('http').Server(app)
const cors = require('cors')

app.use(cors({
    origin: '*'
}))

// body parser
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// importing third party middleware
const helmet = require('helmet')
const morgan = require('morgan')
app.use(helmet())
app.use(morgan('tiny'))


// linking with database
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_LINK || 'mongodb://localhost/gettingstarted', {

}).then(() => {
    console.log('connected to the database')
})


// Errors Handling 



// importing and assinging custom routes
const registrations = require('./backend/routes/registrations')
const user = require('./backend/routes/user')
const transitions = require('./backend/routes/transitions')

app.use('/auth', registrations)
app.use('/user', user)
app.use('/transitions', transitions)





app.get('/', (req, res) => {
    res.json({
        type: 'msg',
        msg: "Hello from express server"
    })
})


// Server will run from here
const PORT = process.env.PORT || 5000
Server.listen(PORT, () => {
    console.log(`Server listing on port ${PORT}`)
})


