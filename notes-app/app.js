const chalk = require('chalk')
const getNotes = require('./notes')
const yargs = require('yargs')

yargs.command({
    command : 'add',
    describe: 'Add a new note',
    builder: {
        title : {
            describe: 'Note title'
        }
    },
    handler: function (argv) {
        console.log('Adding a new note!', argv)
    }
})

yargs.command({
    command : 'remove',
    describe: 'Remove a new note',
    handler: function () {
        console.log('Removing a new note!')
    }
})

yargs.command({
    command : 'list',
    describe: 'List your notes',
    handler: function () {
        console.log('Listing out all notes.')
    }
})

yargs.command({
    command : 'read',
    describe: 'Read a note',
    handler: function () {
        console.log('Read a new note!')
    }
})

console.log(yargs.argv)