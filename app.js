const express = require('express')
const app = express()
const mysql = require('mysql')
const port = 3000

const connection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "1q2w3e4r"
})

connection.connect( (err) => {
    if(err) console.log(err)
    console.log("Mysql Connect!")
})

app.get('/', (req,res) => {
    res.send("Hello")
})

app.listen(port, () => {
    console.log(`Now listen on port: ${port}`)
})