const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({_id : decoded._id, 'tokens.token' : token })
    
        if(!user) {
            throw new Error()
        }

        // Attach user and token data to the request in order to 
        // access it in routing. Saving redundunt requests
        req.user = user
        req.token = token
        
        next()
    } catch (e) {
        res.status(401).send({error : 'Please authenticate.'})
    }    
}

// Site Maintenance Middleware
// app.use((req,res,next) => {
//     res.status(503).send('Site under maintenance.')
// })


module.exports = auth