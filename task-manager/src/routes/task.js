const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Task = require('../models/task')

// Save task
router.post('/tasks', auth, async (req,res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner : req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})

// GET tasks?completed=true
// GET tasks?limit=10&skip=20
// GET tasks?sortBy=createdAt:asc
// Fetch all the tasks from the database
router.get('/tasks', auth, async (req,res) => {

    const match = { owner : req.user._id }

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    const sort = {}
    if(req.query.sortBy) {
        // parts => [createdAt, asc/desc]
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        const tasks = await Task.find(match, null, {
            limit : parseInt(req.query.limit),
            skip : parseInt(req.query.skip),
            sort : sort
        }).exec()
        // Alternate
        // await req.user.populate('tasks')
        // req.send(req.user.tasks)
        res.send(tasks)   // Success => Fetched successfully
    } catch (e) {
        console.log(e)
        res.status(500).send(e)  // Data not fetched => Internal server error
    }

})

// Find a task based on its id
router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id
    
    try {
        const task = await Task.findOne({ _id, owner : req.user._id})
        
        if(!task) {
            return res.status(404).send()
        }

        res.send(task)   // Resource updated successfully
    } catch (e) {
        res.status(500).send(e)    // Data not fetched => Internal server error
    }

})

// Update a task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error : 'Invalid updates!'})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if(!task) {
            return res.status(404).send('Task not found')
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete a task
router.delete('/tasks/:id', auth, async (req,res) => {
    try {
        
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if(!task) {
            return res.status(404).send('Task not found')
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router