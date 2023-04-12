const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

// Express app init
const app = express()

// Defining the port
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


// Listen to all the requests on the port where server is running
app.listen(port, () => {
    console.log('Server is running on port', port)
})