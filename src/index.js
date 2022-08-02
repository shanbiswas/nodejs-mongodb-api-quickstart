require('module-alias/register')
require('dotenv').config()

// load mongoose
require('@src/config/mongoose')

const app = require('@src/app')
const port = process.env.PORT

app.listen(port)
// app.listen(port, '192.168.0.103')