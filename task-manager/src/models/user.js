const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema(
    {
        name : {
            type: "String",
            required : true,
            trim : true,
        },
        email : {
            type : String,
            unique : true,
            required : true,
            trim : true,
            lowercase : true,
            validate (value) {
                if (!validator.isEmail(value)) {
                    throw new Error ('Email is invalid')
                }
            }
        },
        age : {
            type : Number,
            default : 0,
            validate (value) {
                if(value < 0) {
                    throw new Error('Age must be a positive number')
                }
            }
        },
        password : {
            type : String,
            required : true,
            minLength : 6,
            trim : true,
            validate (value) {
                if(value.toLowerCase().includes('password')){
                    throw new Error('Password cannot include the string password ')
                }
            }
        },
        // Array of tokens for logging a user into multiple devices.
        tokens : [{
            token : {
                type : String,
                required : true
            }
        }],
        avatar: {
            type : Buffer
        }
    }, {
        timestamps : true 
    }
)

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    // Will work for both -- creating and updating user passwords.
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()   // Tells the processor that the preprocessing code is over and it can move on to complete the task (save)
             // If not used, the preocessor will never know that the preprocessing is done.
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner : user._id})
    next()
})

// methods => Instance methods.. accessible on instances (objects)
userSchema.methods.generateAuthToken = async function () {
     const user = this
     const token = jwt.sign({ _id : user._id.toString() }, process.env.JWT_SECRET)

    //  Save auth tokens to login to multiple devices at the same time.
    //  And if logged out of one device, user can stay logged in to other devices.
     user.tokens = user.tokens.concat({ token })
     await user.save()

     return token
}

// Set up reverse relationship with Tasks to fetch Tasks based on a user _id.
// Will not be stored actually in the database.
userSchema.virtual('tasks', {
    ref : 'Task',
    localField: '_id',
    foreignField : 'owner'
})

/* toJSON -> Automatically add the method to all the objects and 
            control what is sent back as a return value.
*/ 
// Avoid sending private data back to user.
userSchema.methods.toJSON = function () {
    const user = this

    // Making a copy of user object
    const userObject = user.toObject()

    // Removing private data fields
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// statics => Model methods.. accessible on model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to Login')
    }

    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User