const express = require("express")
const app = express()
const PORT = process.env.port || 5000

app.get("/", (req,res) => {
    res.send("Server up and running")
})

const sendMail = require('./controllers/sendMail')

app.get("/mail", sendMail);

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`)
        })
    } catch(error) {}
}

start()