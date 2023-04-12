const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { removeUser, addUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

app.get('', (res,req) => {
    res.send('index.html')
})

// socket.emit => Send a message to and fro between server and a single client
// io.emit => Pass on the same message to all the connected clients
// socket.broadcast => Send message to all the users except itself
// Adding .to (io.to.emit, socket.broadcast.to.emit) => Allows to share messages within the same room

// Runs everytime when a new client connects to server and handling their activities
io.on('connection', (socket) => {
    console.log('New Webpack Connection!')

    
    // User joining room
    socket.on('join', (options, callback) => {
        // options -> username, room
        const {user, error} = addUser({ id: socket.id, ...options })
        
        if(error) {
            return callback(error)
        }
        
        socket.join(user.room)
        
        // Static messages
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room : user.room,
            users: getUsersInRoom(user.room),
        })


        callback()
    })

    // Recieve message from client
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        
        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback('Delievered')
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', 
                generateLocationMessage(
                    user.username,
                    `http://google.com/maps?q=${location.latitude},${location.longitude}`
                )
        )
        callback()
    })

    // inbuilt function to handle disconnection of client 
    socket.on('disconnect', () => {
        // Removing from users array via socket id
        const user = removeUser(socket.id)
        
        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room : user.room,
                users : getUsersInRoom(user.room)
            })
        }
        
    })
})

server.listen(PORT ,() => {
    console.log(`Server up and running on PORT`, PORT)
})