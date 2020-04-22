const express = require('express')
const app = express()
const mysql = require('mysql')
const body_Parser = require('body-parser') 
const port = 3000
const con = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "1q2w3e4r",
    database: "my_db"
})


app.use(body_Parser.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded
app.use(body_Parser.json()) // for parsing application/json
//mysql connect
con.connect( (err) => {
    if(err) console.log(err)
    console.log("Mysql Connect!")
})
//read whole contents
app.get('/api/loadcontents', (req,res) => {
    const sql = 'SELECT * FROM CONTENTS'
    con.query(sql, (err,rows,fields) => {
        if(err) return console.log(err)
        console.log(rows)
        res.send(rows)
    })
})
//read only content what choosen id 
app.get('/api/read/:id', (req,res) => {
    const sql = `SELECT * FROM CONTENTS WHERE id=${req.params.id}`
    con.query(sql, (err, rows, fields) => {
        if(err) return console.log(err)
        if(rows[0] == undefined) res.sendStatus(404) //해당 데이터 없음
        res.send(rows)
    })
})
app.post('/api/create', (req,res) => {
    const sql = "INSERT INTO CONTENTS (name, description, image) VALUE (?, ?, 1)"
    const params = [req.body.title, req.body.des]
    console.log(req.body.title)
    con.query(sql, params, (err, rows, fields) => {
        if(err) return console.log(err)
        res.sendStatus(200)
    })
})

app.listen(port, () => {
    console.log(`Now listen on port: ${port}`)
})