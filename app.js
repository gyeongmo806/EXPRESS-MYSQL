const express = require('express')
const app = express()
const mysql = require('mysql')
const port = 3000
const con = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "1q2w3e4r",
    database: "my_db"
})

//mysql connect
con.connect( (err) => {
    if(err) console.log(err)
    console.log("Mysql Connect!")
})
//load whole contents
app.get('/api/loadcontents', (req,res) => {
    const sql = 'SELECT * FROM CONTENTS'
    con.query(sql, (err,rows,fields) => {
        if(err) console.log(err)
        console.log(rows)
        res.send(rows)
    })
})
//read only content what collect to id 
app.get('/api/read/:id', (req,res) => {
    const sql = `SELECT * FROM CONTENTS WHERE id=${req.params.id}`
    con.query(sql, (err, rows, fields) => {
        if(err) console.log(err)
        res.send(rows)
    })
})

app.listen(port, () => {
    console.log(`Now listen on port: ${port}`)
})