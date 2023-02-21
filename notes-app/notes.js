const fs = require('fs')
const chalk = require('chalk')

const addNote = (title, body) => {
    const notes = loadNotes()
    const duplicateNote = notes.find(note => note.title === title)

    if(!duplicateNote){
        notes.push({
            title,
            body
        })
        saveNotes(notes)
        console.log(chalk.inverse.bold.green('New note added!'))
    } else {
        console.log(chalk.inverse.bold.red('Note title taken!'))
    }
}

const removeNote = (title) => {
    const notes = loadNotes()
    const updatedNotes = notes.filter(note => note.title !== title)
    
    if(notes.length > updatedNotes.length) {
        console.log(chalk.inverse.bold.green(' Note Removed! '))
        saveNotes(updatedNotes)
    } else {
        console.log(chalk.inverse.bold.red(' No note found! '))
    }
}

const listNotes = () => {
    const notes = loadNotes()
    console.log(chalk.inverse.bold.blue('\n\t  Your notes  \n'))
    notes.forEach(note => console.log('-' , note.title))
}

const readNote = (title) => {
    const note = loadNotes().find(note => note.title === title)
    
    if(note) {
        console.log(chalk.inverse.bold(`\n\t  ${note.title}  \n`))
        console.log(note.body.toString())
    } else {
        console.log(chalk.inverse.bold.red('No note found!'))
    }
}

const saveNotes = (notes) => {
    fs.writeFileSync(
        'notes.json',
        JSON.stringify(notes, null, 2)
    )
}

const loadNotes = () => {
    try {
        return JSON.parse(
            fs.readFileSync('notes.json')
            .toString()
        )
    } catch (e) {
        return []
    }
}
module.exports = {
    addNote,
    removeNote,
    listNotes,
    readNote
}