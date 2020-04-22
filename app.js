const express = require('express')
const app = express()
const mysql = require('mysql')
const body_Parser = require('body-parser') 
const pug = require('pug')
const port = 3000
const con = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "1q2w3e4r",
    database: "my_db"
})
let data = []
app.set('view engine','pug')
app.use(express.static('public'))
app.use(body_Parser.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded
app.use(body_Parser.json()) // for parsing application/json
//mysql connect
con.connect( (err) => {
    if(err) console.log(err)
    console.log("Mysql Connect!")
})
//home
app.get('/', (req,res) => {
    res.render('index',{data : data})
})
//create
app.get('/create', (req,res) => {
    res.render('create')
})
app.get('/read/:id', (req,res) => {
    const sql = `SELECT * FROM CONTENTS WHERE id=${req.params.id}`
    con.query(sql, (err, rows, fields) => {
        if(err) return console.log(err)
        if(rows[0] == undefined) res.sendStatus(404) //해당 데이터 없음
        console.log(rows)
        res.render('read',{data : rows[0]})
    })
})






//read whole contents api
app.get('/api/loadcontents', (req,res) => {
    const sql = 'SELECT * FROM CONTENTS'
    con.query(sql, (err,rows,fields) => {
        if(err) return console.log(err)
        console.log("Client : --" + req.ip.substr(7) + "-- load contents")
        res.send(rows)
    })
})
//read only content what choosen id api
app.get('/api/read/:id', (req,res) => {
    const sql = `SELECT * FROM CONTENTS WHERE id=${req.params.id}`
    con.query(sql, (err, rows, fields) => {
        if(err) return console.log(err)
        if(rows[0] == undefined) res.sendStatus(404) //해당 데이터 없음
        console.log("Client : --" + req.ip.substr(7) + "-- read content ID : " + req.params.id)
        res.send(rows)
    })
})
//create api
app.post('/api/create', (req,res) => {
    const sql = "INSERT INTO CONTENTS (name, description, image) VALUE (?, ?, 1)"
    const params = [req.body.title, req.body.des]
    con.query(sql, params, (err, rows, fields) => {
        if(err) return console.log(err)
        console.log(`ID : ${rows.insertId} - CREATE SUCCESS`)
        res.redirect('/')
    })
})
//update api
app.post('/api/update/:id', (req,res) => {
    const sql = "UPDATE CONTENTS SET name=?, description=? WHERE id=?"
    const params = [req.body.title, req.body.des, req.params.id]
    con.query(sql, params, (err, rows, fields) => {
        if(err) return console.log(err)
        console.log(`ID : ${req.params.id} - UPDATE SUCCESS`)
        res.sendStatus(200)
    })
})
//delete api
app.post('/api/delete/:id', (req,res) => {
    const sql = "DELETE FROM CONTENTS WHERE id=" + req.params.id
    con.query(sql, (err, rows, fields) => {
        if(err) return console.log(err)
        console.log(`ID : ${req.params.id} - DELETE SUCCESS`)
        res.sendStatus(200)
    })
})

//서비스 사용자가 많아지는걸 생각해서
//전체 리스트를 서버가 일정 시간마다 받아와 저장 후 클라이언트로 보내줌
setInterval(() => {
    const sql = 'SELECT * FROM CONTENTS'
    con.query(sql, (err,rows,fields) => {
        if(err) return console.log(err)
        console.log("load Data")
        data = rows
    })
},2000)

app.listen(port, () => {
    console.log(`Now listen on port: ${port}`)
})