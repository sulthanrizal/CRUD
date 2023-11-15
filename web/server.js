const fs = require('fs')
const express = require('express')
var bodyParser = require('body-parser')
const path = require('path')

const _dirname = path.resolve()
const datapath = path.join(_dirname, 'db', 'data.json')
const app = express()
const port = 3000
const data = JSON.parse(fs.readFileSync(datapath, 'utf-8'))



app.set('view engine', 'ejs')

app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('list', { data })
})

app.get('/add', (req, res) => { //
    res.render('add')
})

app.post('/add', (req, res) => {
    let dataBaru = { name: req.body.nama, height: req.body.height, weight: req.body.weight, birthdate: req.body.birthdate, married: req.body.married, }
    if (dataBaru.married == 'true') {
        dataBaru.married = true
        data.push(dataBaru)
    } else if (dataBaru.married == "false") {
        dataBaru.married = false
        data.push(dataBaru)
    } else if (dataBaru.married == "null") {
        dataBaru.married = null
        data.push(dataBaru)
    }
    fs.writeFileSync(datapath, JSON.stringify(data), 'utf-8')
    res.redirect('/')
})

app.get('/delete/:id', (req, res) => {
    const id = req.params.id
    data.splice(id, 1)
    fs.writeFileSync(datapath, JSON.stringify(data), 'utf-8')
    res.redirect('/')
})

app.get('/update/:id', (req, res) => {
    const id = req.params.id
    const updateData = data[id]
    res.render('update', { updateData })

})

app.post('/update/:id', (req, res) => {
    const id = req.params.id
    const update = { name: req.body.nama, height: req.body.height, weight: req.body.weight, birthdate: req.body.birthdate, married: JSON.parse(req.body.married) }
    data.splice(id, 1, update)
    fs.writeFileSync(datapath, JSON.stringify(data), 'utf-8')
    res.redirect('/') // balik lagi ke list
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})





