/** chat.js
 * Helper file for client side communication
 * Accesses username and room from login query (location)
 * Renders chat templates like message and location for a specific user and room
 * Events : 
    * On message
    * On locationMessage
    * Handling message send
    * Handling location send
    * On Join
 */

// io is used to address all the connected clients via server
const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationmessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// Recieve messsage from server
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format(`h:mm a`)
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationmessageTemplate, {
        username : message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format(`h:mm a`)
    })
    $messages.insertAdjacentHTML('beforeend', html)
    
})

// Room Data Handling ( UserList )
socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html
})

// Extract values from form data (input message).
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // Disable till acknowlwedged
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value  // Alternate way
    
    // Send message to the server
    socket.emit('sendMessage', message, (error) => {
        // enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error) {
            return console.log(error)
        }
        
        console.log('Message delivered', message)
    })
})

// On clicking Send Location
$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) { 
        return alert('Geolocation is not supported by your browser')
    }

    // Disable till acknowlwedged
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            longitude : position.coords.longitude,
            latitude : position.coords.latitude
        }, (error) => {
            
            // Enabling button again
            $sendLocationButton.removeAttribute('disabled')
            if(error) {
                return console.log(error)
            }

            console.log('Location shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error)
        // Send the user back to login page
        location.href = '/'
    }
})