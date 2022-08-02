require('dotenv').config()
const mongoose = require('mongoose')
const http = require('@src/shared/helpers/http')

main().catch(err => {
  http.handleError({err})
})

async function main() {
  await mongoose.connect(process.env.MONGOOSE_URI)
}