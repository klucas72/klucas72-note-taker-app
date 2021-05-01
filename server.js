//required dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
let noteDatabase = require('./db/db.json');
const uuid = require('uuid');
const { request } = require('http');

const PORT = process.env.PORT || 3000;

//set up constant for express app
const app = express();

//set up express to use json and parsing of data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//sets up routes for home page(landing page) and notes page as well as get, post, and delete API commands.

//root route
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
//note html page route
app.get('/notes', (req, res) => {
    res.sendFile((path.join(__dirname, "/public/notes.html")));
});

//get route for api/notes route
app.get('/api/notes', (req, res) => {
    res.json(noteDatabase);
})

//post route for api/notes route
app.post('/api/notes', (req, res) => {
    console.log('Creating new note');
    const newNote = req.body
    // let filePath = path.join(__dirname, "./db/db.json");
    if (!newNote.title || !newNote.text) {
        throw new Error("please enter information");
    }
    newNote.id = uuid.v1();

    let updatedDatabase = noteDatabase
    updatedDatabase.push(newNote);
    //writing new note to the json database
    fs.writeFile("./db/db.json", JSON.stringify(updatedDatabase), (err) => {
        if (err) throw err;
        console.log('success!');
    })

});
//delete route for the api/notes that deletes a note from the json
app.delete('/api/notes/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    noteDatabase = noteDatabase.filter(({ id }) => id != req.params.id);
    console.log(noteDatabase);
    fs.writeFile("./db/db.json", JSON.stringify(noteDatabase), (err) => {
        if (err) throw err;
    })
    res.json(noteDatabase);
})

app.listen(PORT, () => {
    console.log(`app is currently running on port ${PORT}`);
});