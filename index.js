
require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/instagram', (req, res) => { 
    res.send('gourabsr4')
})
app.get('/facebook', (req,res) => {
    res.send('<h1>My Facebook id : </h1> Gourab Ganguly')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})