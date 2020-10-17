const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const fs = require('fs')

app.set('view engine', 'ejs')
app.use(ejsLayouts)
// body-parser middleware (it makes req.body work)
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res)=>{
    res.render('home')
})

// ----> DINO INDEX ROUTE <------
app.get('/dinosaurs', (req, res)=>{
    // take the text from dinosaurs.json and store it in a variable
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs) // convert the string to an array
    
    // handle a query string if there is one
    let nameFilter = req.query.nameFilter
    if(nameFilter){ // reassign dinoData to only be an array of dinos whose name matches the query string name (and make it ignore case)
        dinoData = dinoData.filter(dino=>{
            return dino.name.toLowerCase() === nameFilter.toLowerCase()
        })
    }
    
    res.render('index', {dinosaurs: dinoData})
})

// ----> DINO NEW ROUTE <------
app.get('/dinosaurs/new', (req, res)=>{
    res.render('new')
})

// ----> DINO SHOW ROUTE <------
app.get('/dinosaurs/:idx', (req, res)=>{
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // get array index from url parameter
    let dinoIndex = req.params.idx
    console.log(dinoData[dinoIndex])
    res.render('show', {dino: dinoData[dinoIndex], dinoId: dinoIndex})
})

// ----> DINO POST ROUTE <------
app.post('/dinosaurs', (req, res)=>{
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    dinoData.push(req.body) // push the new dino to the array
    // save the new dinoData array to the dinosaurs.json file
    // JSON.stringify does the opposite of JSON.parse
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData))
    // redirect to the GET /dinosaurs route (index)
    res.redirect('/dinosaurs')
})

app.listen(8000, ()=>{
    console.log('You\'re listening to the smooth sounds of port 8000.' )
})