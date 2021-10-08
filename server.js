const express = require('express')
const {json, urlencoded} = require('body-parser')
const cors = require('cors')
const sqlite3 = require("sqlite3");
const {Router} = require('express')

const server = express()
server.use(cors())
server.use(json())
server.use(urlencoded({extended: true}))

const router = Router()

const db = new sqlite3.Database('./database/score.db');
db.run('CREATE TABLE IF NOT EXISTS score(time TEXT, location TEXT , point int)');

router.post('/', (req, res) => {
    const {point, location, date} = req.body
    db.serialize(() => {
        db.run('INSERT INTO score(time, location, point) VALUES(?,?,?)', [date, location, point], function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log("added");
            res.send("added");
        });
    });
})

router.get('/', (req, res) => {
    db.serialize(() => {
        db.all('SELECT time, location, point FROM score ', (err, data) => {
            console.log(data)
            if (err) {
                res.send("Error encountered while displaying");
                return console.error(err.message);
            }
            res.send(data);
            console.log("Entry displayed successfully");
        })
    })
})


server.use('/api', router)

server.listen(4545, () => console.log('Server started'))
