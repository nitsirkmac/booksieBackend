// DEPENDENCIES

require("dotenv").config()
const { PORT, DATABASE_URL } = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const seed = require("./seed")

// DATABASE CONNECTION
mongoose.connect(DATABASE_URL)
mongoose.connect(process.env.DATABASE_URL, {})
mongoose.set('strictQuery', true);

// Connection Events
const db = mongoose.connection;
db.on("error", (err) => console.log(err.message + " is mongo not running?"));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

// MODELS
const BooksieSchema = new mongoose.Schema({
    title: { type: String },
    author: { type: String },
    genre: { type: String },
    img: { type: String },
    description: { type: String }
  })

const Booksie = mongoose.model('Booksie' , BooksieSchema)

// MIDDLEWARE
app.use(cors()) 
app.use(morgan("dev")) 
app.use(express.json()) 
app.use(express.urlencoded({extended: false})); 

// test Route
app.get("/", (req, res) => {
    res.send("“A reader lives a thousand lives before he dies . . . The man who never reads lives only one.” - George R.R. Martin")
})

// SEED
app.get('/seed', (req, res) => {
    Booksie.create(seed, (err, data) => {
      res.redirect('/booksie')
    })
  })

// INDEX
app.get('/booksie' , async (req,res) =>{
    try {
        res.status(200).json(await Booksie.find ({})) 
    } catch (error) {
        res.status(400).json(error)
    }
}) 

// DELETE
app.delete('/booksie/:id', async (req, res) => {
    try {
        res.status(200).json(await Booksie.findByIdAndRemove(
            req.params.id,
            (foundBook) => {
                res.redirect('/booksie')
            }
            ))
    } catch {
        res.status(400).json(error)
    }
})

// UPDATE
app.put('/booksie/:id', async (req, res) => {
    try {
        res.status(200).json(await Booksie.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true},
            (updatedBook) => {
                res.redirect(`/booksie/${req.params.id}`)
            }
        ))
    } catch (error) {
        res.status(400).json(error)
    }
})

// CREATE
app.post('/booksie' , async (req,res) => {
    try {
        res.status(200).json(await Booksie.create(
            req.body,
            (createdBook) => {
                res.redirect('/booksie')
            }))
    } catch (error) {
        res.status(400).json(error)
    }
})

// EDIT
app.get('/booksie/:id/edit', async (req, res) => {
    try {
        res.status(200).json(await Booksie.findById(
            req.params.id,
        ))
    } catch (error) {
        res.status(400).json(error)
    }
})

// SHOW
app.get('/booksie/:id', async (req, res) => {
    try {
        res.status(200).json(await Booksie.findById(
            req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})



// LISTENER
app.listen(PORT, () => console.log(`listening to the sound of ${PORT} pages turning`))