const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const auth = require('../middleware/auth')
const User = require('../models/user')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

const router = new express.Router()
// Save a user
router.post('/users', async (req,res) => {
    const user = new User(req.body)

    try {
        await user.save()
        // sendWelcomeEmail(user.email, user.name) // SendGrid Welcome Email

        // Generate a token for created user to automatically login after creating a user.
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })   // Success => New user created
    } catch (e) {
        res.status(400).send(e)  // Client side error => Bad Reuqest
    }

})

// Save Avatar
const upload = multer({
    // dest : 'avatars',  // Save file in the file system
    limits : {
        fileSize : 1000000,
    },
    fileFilter (req, file, cb) {
        console.log(file.originalname)
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            console.log('error')
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

// Upload Avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    // Using sharp lib to modify image before saving.
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error : error.message })
})

// Delete Avatar
router.delete('/users/me/avatar', auth, async(req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error : error.message })
})

// Fetch Avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

// Login a user
router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        res.send({ user , token })
    } catch (e) {
        res.status(400).send()
    }
})

// Logout user
router.post('/users/logout', auth, async (req,res) => {
    try {
        // Accessing token received from middleware via req and comparing it to the tokens from db
        // Removing the matched id through array filters
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// Logout All
router.post('/users/logoutAll', auth, async (req,res) => {
    try {
        // Empty the entire array of tokens
        req.user.tokens = []
        await req.user.save()
        
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// Fetch details of the logged user
router.get('/users/me', auth, async (req,res) => {

    // User recieved from mmiddleware.
    res.send(req.user)

})

// // Fetch all the users from the database
// router.get('/users', async (req,res) => {

//     try {
//         const users = await User.find({})
//         res.send(users)   // Success => Fetched successfully
//     } catch (e) {
//         res.status(500).send(e)  // Data not fetched => Internal server error
//     }

// })

// Find a user based on id
// router.get('/users/:id', async (req,res) => {
//     const _id = req.params.id
    
//     try {
//         const user = await User.findById(_id)
        
//         if(!user) {
//             return res.status(404).send('User not found')  // User not found
//         }
    
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e)    // Data not fetched => Internal server error
//     }

// })

// Update a user
router.patch('/users/me', auth,  async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error : 'Invalid updates!'})
    }

    try {
        
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)    // Resource Updated Successfully
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete the logged user
router.delete('/users/me', auth, async (req,res) => {
    try {
        // SendGrid Cancelation Email
        // sendCancelationEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router