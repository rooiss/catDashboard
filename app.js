const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const port = process.env.PORT || 1337
const app = express()

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost/kittie_Dash', {useNewUrlParser: true})
const KittieSchema = new mongoose.Schema ({
    name: String,
    age: Number
})
const Kittie = mongoose.model('Kittie', KittieSchema) 

// getting root route
app.get('/', (req,res) => {
    Kittie.find({}, function (err, kitties){
        if (err) {
            console.log('~~~ Error on Root Route')
        } else {
            res.render('index', {kittie_info: kitties})
        }
    })
})

// displays form for new user
app.get('/kitties/new', (req,res) => {
    res.render('new')
})
// post route for making a new kittie will redirect to index
app.post('/kitties', (req,res) => {
    const kittie = new Kittie()
    kittie.name = req.body.name
    kittie.age = req.body.age
    kittie.save(err => {
        if (err) {
            console.log('~~~ Error on Creating new kittie')
        } else {
            console.log('~~~ Created new Kittie!')
        }
        res.redirect('/')
    })
})

// displays info for specific user of that id
app.get('/kitties/:id', (req,res) => {
    Kittie.find({_id: req.params.id}, (err, kitties) => {
        if (err) {
            console.log('~~~ Error on ID')
        } else {
            res.render('showkittie', {kittie_info: kitties})
        }
    })
})


app.get('/kitties/edit/:id', (req,res) => {
    Kittie.find({_id: req.params.id}, (err,kitties) => {
        if (err) {
            console.log('~~~ Error on finding edit')
        } else {
            res.render('edit', {kittie_info: kitties})
        }
    })
})
// post route for edit
app.post('/kitties/:id', (req,res) => {
    Kittie.update({_id: req.params.id}, {name: req.body.name, age: req.body.age}, (err) => {
        if (err) {
            console.log('~~~ Error on updating ')
        } else {
            console.log('~~~ Changed da ting')
            res.redirect('/')
        }
    })
})

app.get('/kitties/destroy/:id', (req,res) => {
    Kittie.remove({_id: req.params.id}, (err) => {
        if (err) {
            console.log('~~~ Error on Delete')
        } else {
            console.log('~~~ DELETED :((')
            res.redirect('/')
        }
    })
})
console.log(`Server listening... go to http://localhost:${port}`)
app.listen(port)
