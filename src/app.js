
const express = require('express')
const app = express()
const morgan = require('./utils/morgan')
const fileUpload = require('express-fileupload')

// Fetch routes
const basicRoutes = require('./routes/route')
const userRoute = require('./core/user/userRoute')
const postRoute = require('./core/post/postRoute')

app.use(express.json())
app.use(morgan.errorHandler)
app.use(fileUpload({ 
    safeFileNames: true,
    createParentPath: true,
    preserveExtension: true
}))

// Function to serve all static files
app.use('/public', express.static('public'))

// Register routes
app.use(basicRoutes)
app.use(userRoute)
app.use(postRoute)


module.exports = app;

